import { NextRequest } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '../../lib/db';
import { bankAccounts } from '../../lib/schema';
import { BankAccountUpdateSchema } from '../../lib/validation';
import { getUserFromRequest, createErrorResponse, createSuccessResponse } from '../../lib/auth';

// PUT /api/accounts/[id] - Update bank account
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const accountId = parseInt(params.id);
    if (isNaN(accountId)) {
      return createErrorResponse('Invalid account ID', 400);
    }

    const body = await request.json();
    const validatedData = BankAccountUpdateSchema.parse(body);

    // Check if account exists and belongs to user
    const [existingAccount] = await db.select().from(bankAccounts)
      .where(and(eq(bankAccounts.id, accountId), eq(bankAccounts.ownerId, user.userId)))
      .limit(1);

    if (!existingAccount) {
      return createErrorResponse('Account not found', 404);
    }

    // Update account
    const updateData: any = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.balance !== undefined) updateData.balance = validatedData.balance.toString();
    if (validatedData.currency !== undefined) updateData.currency = validatedData.currency;

    const [updatedAccount] = await db.update(bankAccounts)
      .set(updateData)
      .where(eq(bankAccounts.id, accountId))
      .returning();

    return createSuccessResponse({
      message: 'Account updated successfully',
      account: updatedAccount,
    });

  } catch (error: any) {
    if (error.name === 'ZodError') {
      return createErrorResponse('Invalid input data', 400);
    }
    
    console.error('Update account error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// DELETE /api/accounts/[id] - Delete bank account
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const accountId = parseInt(params.id);
    if (isNaN(accountId)) {
      return createErrorResponse('Invalid account ID', 400);
    }

    // Check if account exists and belongs to user
    const [existingAccount] = await db.select().from(bankAccounts)
      .where(and(eq(bankAccounts.id, accountId), eq(bankAccounts.ownerId, user.userId)))
      .limit(1);

    if (!existingAccount) {
      return createErrorResponse('Account not found', 404);
    }

    // Delete account
    await db.delete(bankAccounts).where(eq(bankAccounts.id, accountId));

    return createSuccessResponse({
      message: 'Account deleted successfully',
    }, 204);

  } catch (error) {
    console.error('Delete account error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}