import { NextRequest } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '../../lib/db';
import { transactions } from '../../lib/schema';
import { TransactionUpdateSchema } from '../../lib/validation';
import { getUserFromRequest, createErrorResponse, createSuccessResponse } from '../../lib/auth';

// PUT /api/transactions/[id] - Update transaction
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const transactionId = parseInt(params.id);
    if (isNaN(transactionId)) {
      return createErrorResponse('Invalid transaction ID', 400);
    }

    const body = await request.json();
    const validatedData = TransactionUpdateSchema.parse(body);

    // Check if transaction exists and belongs to user
    const [existingTransaction] = await db.select().from(transactions)
      .where(and(eq(transactions.id, transactionId), eq(transactions.ownerId, user.userId)))
      .limit(1);

    if (!existingTransaction) {
      return createErrorResponse('Transaction not found', 404);
    }

    // Build update data
    const updateData: any = {};
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.amount !== undefined) updateData.amount = validatedData.amount.toString();
    if (validatedData.type !== undefined) updateData.type = validatedData.type;
    if (validatedData.date !== undefined) updateData.date = validatedData.date.toISOString().split('T')[0];
    if (validatedData.category !== undefined) updateData.category = validatedData.category;
    if (validatedData.accountId !== undefined) updateData.accountId = validatedData.accountId;
    if (validatedData.creditCardId !== undefined) updateData.creditCardId = validatedData.creditCardId;
    if (validatedData.toAccountId !== undefined) updateData.toAccountId = validatedData.toAccountId;

    // Update transaction
    const [updatedTransaction] = await db.update(transactions)
      .set(updateData)
      .where(eq(transactions.id, transactionId))
      .returning();

    return createSuccessResponse({
      message: 'Transaction updated successfully',
      transaction: updatedTransaction,
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return createErrorResponse('Invalid input data', 400);
    }
    
    console.error('Update transaction error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// DELETE /api/transactions/[id] - Delete transaction
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const transactionId = parseInt(params.id);
    if (isNaN(transactionId)) {
      return createErrorResponse('Invalid transaction ID', 400);
    }

    // Check if transaction exists and belongs to user
    const [existingTransaction] = await db.select().from(transactions)
      .where(and(eq(transactions.id, transactionId), eq(transactions.ownerId, user.userId)))
      .limit(1);

    if (!existingTransaction) {
      return createErrorResponse('Transaction not found', 404);
    }

    // Delete transaction
    await db.delete(transactions).where(eq(transactions.id, transactionId));

    return createSuccessResponse({
      message: 'Transaction deleted successfully',
    }, 204);

  } catch (error) {
    console.error('Delete transaction error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}