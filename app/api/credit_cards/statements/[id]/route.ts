import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";

import {
  getUserFromRequest,
  createErrorResponse,
  createSuccessResponse,
} from "../../../lib/auth";
import { db } from "../../../lib/db";
import { creditCardStatements, creditCards } from "../../../lib/schema";

// GET /api/credit_cards/statements/:id - Get statement details
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

    // Get statement with credit card info
    const [statement] = await db
      .select({
        id: creditCardStatements.id,
        creditCardId: creditCardStatements.creditCardId,
        creditCardName: creditCards.name,
        bankCode: creditCardStatements.bankCode,
        statementDate: creditCardStatements.statementDate,
        dueDate: creditCardStatements.dueDate,
        previousBalance: creditCardStatements.previousBalance,
        paymentsReceived: creditCardStatements.paymentsReceived,
        purchases: creditCardStatements.purchases,
        fees: creditCardStatements.fees,
        interest: creditCardStatements.interest,
        totalAmount: creditCardStatements.totalAmount,
        fileName: creditCardStatements.fileName,
        status: creditCardStatements.status,
        importedAt: creditCardStatements.importedAt,
        createdAt: creditCardStatements.createdAt,
        updatedAt: creditCardStatements.updatedAt,
      })
      .from(creditCardStatements)
      .leftJoin(creditCards, eq(creditCardStatements.creditCardId, creditCards.id))
      .where(
        and(
          eq(creditCardStatements.id, statementId),
          eq(creditCardStatements.ownerId, user.userId)
        )
      );

    if (!statement) {
      return createErrorResponse("Fatura não encontrada", 404);
    }

    return createSuccessResponse({ statement });
  } catch (error) {
    console.error("Get statement error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
