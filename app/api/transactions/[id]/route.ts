import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";

import {
  getUserFromRequest,
  createErrorResponse,
  createSuccessResponse,
  handleZodError,
} from "../../lib/auth";
import { db } from "../../lib/db";
import { transactions, categories } from "../../lib/schema";
import { TransactionUpdateSchema } from "../../lib/validation";

// PUT /api/transactions/[id] - Update transaction
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
    const transactionId = parseInt(resolvedParams.id);
    if (isNaN(transactionId)) {
      return createErrorResponse("Invalid transaction ID", 400);
    }

    const body = await request.json();
    const validatedData = TransactionUpdateSchema.parse(body);

    // Validate category if provided
    if (validatedData.categoryId !== undefined) {
      const [category] = await db
        .select()
        .from(categories)
        .where(
          and(
            eq(categories.id, validatedData.categoryId),
            eq(categories.ownerId, user.userId),
          ),
        )
        .limit(1);

      if (!category) {
        return createErrorResponse("Categoria não encontrada", 404);
      }
    }

    // Check if transaction exists and belongs to user
    const [existingTransaction] = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.ownerId, user.userId),
        ),
      )
      .limit(1);

    if (!existingTransaction) {
      return createErrorResponse("Transaction not found", 404);
    }

    // Build update data
    const updateData: Record<string, string | number | Date | null> = {};
    if (validatedData.description !== undefined)
      updateData.description = validatedData.description;
    if (validatedData.amount !== undefined)
      updateData.amount = validatedData.amount.toString();
    if (validatedData.type !== undefined) updateData.type = validatedData.type;
    if (validatedData.date !== undefined) updateData.date = validatedData.date;
    if (validatedData.categoryId !== undefined)
      updateData.categoryId = validatedData.categoryId;
    if (validatedData.accountId !== undefined)
      updateData.accountId = validatedData.accountId;
    if (validatedData.creditCardId !== undefined)
      updateData.creditCardId = validatedData.creditCardId;
    if (validatedData.toAccountId !== undefined)
      updateData.toAccountId = validatedData.toAccountId;

    // Update transaction
    const [updatedTransaction] = await db
      .update(transactions)
      .set(updateData)
      .where(eq(transactions.id, transactionId))
      .returning();

    return createSuccessResponse({
      message: "Transação atualizada com sucesso",
      transaction: updatedTransaction,
    });
  } catch (error) {
    const zodErrorResponse = handleZodError(error);
    if (zodErrorResponse) return zodErrorResponse;

    console.error("Update transaction error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// DELETE /api/transactions/[id] - Delete transaction
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
    const transactionId = parseInt(resolvedParams.id);
    if (isNaN(transactionId)) {
      return createErrorResponse("Invalid transaction ID", 400);
    }

    // Check if transaction exists and belongs to user
    const [existingTransaction] = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.ownerId, user.userId),
        ),
      )
      .limit(1);

    if (!existingTransaction) {
      return createErrorResponse("Transaction not found", 404);
    }

    // Delete transaction
    await db.delete(transactions).where(eq(transactions.id, transactionId));

    return createSuccessResponse(
      {
        message: "Transação excluída com sucesso",
      },
      204,
    );
  } catch (error) {
    console.error("Delete transaction error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
