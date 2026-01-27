import { eq, and, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

import {
  getUserFromRequest,
  createErrorResponse,
  createSuccessResponse,
  handleZodError,
} from "../../lib/auth";
import { db } from "../../lib/db";
import { creditCards, transactions } from "../../lib/schema";
import { CreditCardUpdateSchema } from "../../lib/validation";

// PUT /api/credit_cards/[id] - Update credit card
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const resolvedParams = await params;
    const cardId = parseInt(resolvedParams.id);
    if (isNaN(cardId)) {
      return createErrorResponse("Invalid card ID", 400);
    }

    const body = await request.json();
    const validatedData = CreditCardUpdateSchema.parse(body);

    // Check if card exists and belongs to user
    const [existingCard] = await db
      .select()
      .from(creditCards)
      .where(
        and(eq(creditCards.id, cardId), eq(creditCards.ownerId, user.userId)),
      )
      .limit(1);

    if (!existingCard) {
      return createErrorResponse("Credit card not found", 404);
    }

    // Update card
    const updateData: Record<string, string | number> = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.limit !== undefined)
      updateData.limit = validatedData.limit.toString();
    if (validatedData.currentBill !== undefined)
      updateData.currentBill = validatedData.currentBill.toString();

    const [updatedCard] = await db
      .update(creditCards)
      .set(updateData)
      .where(eq(creditCards.id, cardId))
      .returning();

    return createSuccessResponse({
      message: "Credit card updated successfully",
      card: updatedCard,
    });
  } catch (error) {
    const zodErrorResponse = handleZodError(error);
    if (zodErrorResponse) return zodErrorResponse;

    console.error("Update credit card error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// DELETE /api/credit_cards/[id] - Delete credit card
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const resolvedParams = await params;
    const cardId = parseInt(resolvedParams.id);
    if (isNaN(cardId)) {
      return createErrorResponse("Invalid card ID", 400);
    }

    // Check if card exists and belongs to user
    const [existingCard] = await db
      .select()
      .from(creditCards)
      .where(
        and(eq(creditCards.id, cardId), eq(creditCards.ownerId, user.userId)),
      )
      .limit(1);

    if (!existingCard) {
      return createErrorResponse("Credit card not found", 404);
    }

    // Check for existing transactions before deletion
    const [transactionCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(transactions)
      .where(eq(transactions.creditCardId, cardId));

    if (transactionCount && transactionCount.count > 0) {
      return createErrorResponse(
        "Não é possível excluir um cartão com transações existentes",
        400
      );
    }

    // Delete card
    await db.delete(creditCards).where(eq(creditCards.id, cardId));

    return createSuccessResponse(
      {
        message: "Credit card deleted successfully",
      },
      204,
    );
  } catch (error) {
    console.error("Delete credit card error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
