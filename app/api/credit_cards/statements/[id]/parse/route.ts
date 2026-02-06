import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";

import {
  getUserFromRequest,
  createErrorResponse,
  createSuccessResponse,
} from "../../../../lib/auth";
import { db } from "../../../../lib/db";
import { creditCardStatements, statementLineItems, categories } from "../../../../lib/schema";
import { ParserFactory } from "@/lib/services/statement-parsers";
import { AICategorizer } from "@/lib/services/ai-categorizer";
import { DuplicateDetector } from "@/lib/services/duplicate-detector";

// POST /api/credit_cards/statements/:id/parse - Parse uploaded statement
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const statementId = parseInt(params.id, 10);

    if (isNaN(statementId)) {
      return createErrorResponse("ID de fatura inválido", 400);
    }

    // Get statement and verify ownership
    const [statement] = await db
      .select()
      .from(creditCardStatements)
      .where(
        and(
          eq(creditCardStatements.id, statementId),
          eq(creditCardStatements.ownerId, user.userId)
        )
      );

    if (!statement) {
      return createErrorResponse("Fatura não encontrada", 404);
    }

    if (statement.status !== "pending") {
      return createErrorResponse(
        `Fatura já foi processada (status: ${statement.status})`,
        400
      );
    }

    if (!statement.fileData) {
      return createErrorResponse("Dados do arquivo não encontrados", 400);
    }

    // Decode PDF data
    const pdfBuffer = Buffer.from(statement.fileData, "base64");

    // Parse the PDF
    const parser = ParserFactory.getParser(statement.bankCode);
    const parsedStatement = await parser.parse(pdfBuffer, statement.fileName);

    // Get user's categories for AI categorization
    const userCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        type: categories.type,
      })
      .from(categories)
      .where(eq(categories.ownerId, user.userId));

    // Run AI categorization (if available)
    const categorizer = new AICategorizer();
    const categorizationResults = await categorizer.categorizeBatch(
      parsedStatement.lineItems,
      userCategories
    );

    // Run duplicate detection
    const duplicateDetector = new DuplicateDetector();
    const duplicateResults = await duplicateDetector.detectBatch(
      parsedStatement.lineItems,
      statement.creditCardId,
      user.userId
    );

    // Update statement with parsed metadata
    await db
      .update(creditCardStatements)
      .set({
        statementDate: parsedStatement.statementDate,
        dueDate: parsedStatement.dueDate,
        previousBalance: parsedStatement.previousBalance,
        paymentsReceived: parsedStatement.paymentsReceived,
        purchases: parsedStatement.purchases,
        fees: parsedStatement.fees,
        interest: parsedStatement.interest,
        totalAmount: parsedStatement.totalAmount,
        status: "reviewed",
        updatedAt: new Date(),
      })
      .where(eq(creditCardStatements.id, statementId));

    // Insert line items with AI suggestions and duplicate flags
    const lineItemsToInsert = parsedStatement.lineItems.map((item, index) => {
      const categorization = categorizationResults.get(item.description);
      const duplicateResult = duplicateResults[index];

      return {
        statementId,
        date: item.date,
        description: item.description,
        amount: item.amount,
        type: item.type,
        category: item.category || null,
        suggestedCategoryId: categorization?.suggestedCategoryId || null,
        finalCategoryId: null,
        transactionId: null,
        isDuplicate: duplicateResult?.isDuplicate || false,
        duplicateReason: duplicateResult?.bestMatch?.reason || null,
        rawData: {
          parsed: item,
          categorization: categorization || null,
          duplicateMatch: duplicateResult?.bestMatch || null,
        },
      };
    });

    await db.insert(statementLineItems).values(lineItemsToInsert);

    // Get duplicate summary
    const duplicateSummary = duplicateDetector.getSummary(duplicateResults);

    return createSuccessResponse({
      message: "Fatura processada com sucesso",
      statement: {
        id: statement.id,
        statementDate: parsedStatement.statementDate,
        dueDate: parsedStatement.dueDate,
        totalAmount: parsedStatement.totalAmount,
        status: "reviewed",
      },
      summary: {
        totalLineItems: parsedStatement.lineItems.length,
        categorized: Array.from(categorizationResults.values()).filter(
          (r) => r.suggestedCategoryId !== null
        ).length,
        duplicates: duplicateSummary.duplicates,
        possibleDuplicates: duplicateSummary.possibleDuplicates,
        unique: duplicateSummary.unique,
      },
    });
  } catch (error) {
    console.error("Parse statement error:", error);
    
    // Try to update statement status to indicate error
    try {
      await db
        .update(creditCardStatements)
        .set({
          status: "cancelled",
          updatedAt: new Date(),
        })
        .where(eq(creditCardStatements.id, parseInt(params.id, 10)));
    } catch (updateError) {
      console.error("Failed to update statement status:", updateError);
    }

    return createErrorResponse(
      `Erro ao processar fatura: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      500
    );
  }
}
