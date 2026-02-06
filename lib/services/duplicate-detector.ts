import { db } from "@/app/api/lib/db";
import { transactions } from "@/app/api/lib/schema";
import { and, eq, gte, lte, sql } from "drizzle-orm";
import { ParsedLineItem } from "@/lib/schemas/credit-card-statements";
import { fuzzySimilarity } from "@/lib/utils/string-similarity";

/**
 * Information about a potential duplicate transaction
 */
export type DuplicateMatch = {
  existingTransactionId: number;
  confidence: number; // 0-1, how confident we are this is a duplicate
  reason: string;
  matchedFields: {
    date: boolean;
    amount: boolean;
    description: boolean;
    descriptionSimilarity?: number;
  };
};

/**
 * Result of duplicate detection for a line item
 */
export type DuplicateDetectionResult = {
  lineItem: ParsedLineItem;
  isDuplicate: boolean;
  duplicateMatches: DuplicateMatch[];
  bestMatch: DuplicateMatch | null;
};

/**
 * Service for detecting duplicate transactions
 */
export class DuplicateDetector {
  /**
   * Detect duplicates for a batch of line items
   * @param lineItems - Line items to check
   * @param creditCardId - Credit card ID to scope the search
   * @param ownerId - Owner ID for security
   * @returns Array of detection results
   */
  async detectBatch(
    lineItems: ParsedLineItem[],
    creditCardId: number,
    ownerId: number
  ): Promise<DuplicateDetectionResult[]> {
    const results: DuplicateDetectionResult[] = [];

    for (const lineItem of lineItems) {
      const result = await this.detectSingle(lineItem, creditCardId, ownerId);
      results.push(result);
    }

    return results;
  }

  /**
   * Detect duplicates for a single line item
   * @param lineItem - Line item to check
   * @param creditCardId - Credit card ID to scope the search
   * @param ownerId - Owner ID for security
   * @returns Detection result
   */
  async detectSingle(
    lineItem: ParsedLineItem,
    creditCardId: number,
    ownerId: number
  ): Promise<DuplicateDetectionResult> {
    try {
      // Query existing transactions within a date window (±3 days)
      const itemDate = new Date(lineItem.date);
      const startDate = new Date(itemDate);
      startDate.setDate(startDate.getDate() - 3);
      const endDate = new Date(itemDate);
      endDate.setDate(endDate.getDate() + 3);

      const existingTransactions = await db
        .select({
          id: transactions.id,
          description: transactions.description,
          amount: transactions.amount,
          date: transactions.date,
        })
        .from(transactions)
        .where(
          and(
            eq(transactions.ownerId, ownerId),
            eq(transactions.creditCardId, creditCardId),
            gte(transactions.date, startDate.toISOString().split("T")[0]),
            lte(transactions.date, endDate.toISOString().split("T")[0])
          )
        );

      // Find potential duplicates
      const duplicateMatches: DuplicateMatch[] = [];

      for (const existingTx of existingTransactions) {
        const match = this.evaluateMatch(lineItem, existingTx);
        if (match.confidence >= 0.6) {
          // Only include matches with at least 60% confidence
          duplicateMatches.push(match);
        }
      }

      // Sort by confidence (highest first)
      duplicateMatches.sort((a, b) => b.confidence - a.confidence);

      const isDuplicate = duplicateMatches.length > 0 && duplicateMatches[0].confidence >= 0.8;
      const bestMatch = duplicateMatches.length > 0 ? duplicateMatches[0] : null;

      return {
        lineItem,
        isDuplicate,
        duplicateMatches,
        bestMatch,
      };
    } catch (error) {
      console.error("Error detecting duplicates:", error);
      // Return safe default on error
      return {
        lineItem,
        isDuplicate: false,
        duplicateMatches: [],
        bestMatch: null,
      };
    }
  }

  /**
   * Evaluate if an existing transaction matches a line item
   * @param lineItem - New line item
   * @param existingTx - Existing transaction
   * @returns Match information
   */
  private evaluateMatch(
    lineItem: ParsedLineItem,
    existingTx: {
      id: number;
      description: string;
      amount: string;
      date: string;
    }
  ): DuplicateMatch {
    const matchedFields = {
      date: false,
      amount: false,
      description: false,
      descriptionSimilarity: 0,
    };

    let score = 0;
    const reasons: string[] = [];

    // 1. Check date match (exact)
    if (lineItem.date === existingTx.date) {
      matchedFields.date = true;
      score += 0.3; // 30% weight for exact date
      reasons.push("mesma data");
    } else {
      // Partial credit for nearby dates
      const daysDiff = Math.abs(
        (new Date(lineItem.date).getTime() - new Date(existingTx.date).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (daysDiff <= 1) {
        score += 0.15; // 15% for 1 day difference
        reasons.push("data próxima");
      } else if (daysDiff <= 3) {
        score += 0.05; // 5% for 2-3 days difference
      }
    }

    // 2. Check amount match (exact)
    const lineItemAmount = parseFloat(lineItem.amount);
    const existingAmount = parseFloat(existingTx.amount);
    
    if (Math.abs(lineItemAmount - existingAmount) < 0.01) {
      matchedFields.amount = true;
      score += 0.4; // 40% weight for exact amount
      reasons.push("mesmo valor");
    } else {
      // No partial credit for amount - it should be exact
    }

    // 3. Check description similarity (fuzzy)
    const similarity = fuzzySimilarity(lineItem.description, existingTx.description);
    matchedFields.descriptionSimilarity = similarity;

    if (similarity >= 0.9) {
      matchedFields.description = true;
      score += 0.3; // 30% weight for very similar description
      reasons.push("descrição muito similar");
    } else if (similarity >= 0.7) {
      matchedFields.description = true;
      score += 0.2; // 20% for somewhat similar
      reasons.push("descrição similar");
    } else if (similarity >= 0.5) {
      score += 0.1; // 10% for moderately similar
      reasons.push("descrição parcialmente similar");
    }

    // Build reason string
    const reason = reasons.length > 0 
      ? reasons.join(", ") 
      : "baixa similaridade";

    return {
      existingTransactionId: existingTx.id,
      confidence: Math.min(1, score), // Cap at 1.0
      reason,
      matchedFields,
    };
  }

  /**
   * Get duplicate status summary for a batch
   * @param results - Detection results
   * @returns Summary statistics
   */
  getSummary(results: DuplicateDetectionResult[]): {
    total: number;
    duplicates: number;
    unique: number;
    possibleDuplicates: number; // confidence 0.6-0.8
  } {
    const total = results.length;
    const duplicates = results.filter((r) => r.isDuplicate).length;
    const possibleDuplicates = results.filter(
      (r) => !r.isDuplicate && r.bestMatch && r.bestMatch.confidence >= 0.6
    ).length;
    const unique = total - duplicates - possibleDuplicates;

    return {
      total,
      duplicates,
      unique,
      possibleDuplicates,
    };
  }
}
