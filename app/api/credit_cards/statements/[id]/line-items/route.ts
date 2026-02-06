import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";

import {
  getUserFromRequest,
  createErrorResponse,
  createSuccessResponse,
} from "../../../../lib/auth";
import { db } from "../../../../lib/db";
import { creditCardStatements, statementLineItems, categories } from "../../../../lib/schema";

// GET /api/credit_cards/statements/:id/line-items - Get statement line items
export async function GET(
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

    // Verify statement ownership
    const [statement] = await db
      .select({ id: creditCardStatements.id })
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

    // Get line items with category information
    const lineItems = await db
      .select({
        id: statementLineItems.id,
        statementId: statementLineItems.statementId,
        date: statementLineItems.date,
        description: statementLineItems.description,
        amount: statementLineItems.amount,
        type: statementLineItems.type,
        category: statementLineItems.category,
        suggestedCategoryId: statementLineItems.suggestedCategoryId,
        suggestedCategoryName: categories.name,
        finalCategoryId: statementLineItems.finalCategoryId,
        transactionId: statementLineItems.transactionId,
        isDuplicate: statementLineItems.isDuplicate,
        duplicateReason: statementLineItems.duplicateReason,
        rawData: statementLineItems.rawData,
        createdAt: statementLineItems.createdAt,
      })
      .from(statementLineItems)
      .leftJoin(
        categories,
        eq(statementLineItems.suggestedCategoryId, categories.id)
      )
      .where(eq(statementLineItems.statementId, statementId));

    return createSuccessResponse({
      lineItems,
      summary: {
        total: lineItems.length,
        duplicates: lineItems.filter((item) => item.isDuplicate).length,
        categorized: lineItems.filter((item) => item.suggestedCategoryId !== null).length,
        imported: lineItems.filter((item) => item.transactionId !== null).length,
      },
    });
  } catch (error) {
    console.error("Get line items error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
