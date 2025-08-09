import { NextRequest } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '../lib/db';
import { transactions, bankAccounts } from '../lib/schema';
import { TransferCreateSchema } from '../lib/validation';
import { getUserFromRequest, createErrorResponse, createSuccessResponse } from '../lib/auth';

// POST /api/transfers - Create transfer between accounts
export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const body = await request.json();
    const validatedData = TransferCreateSchema.parse(body);

    // Validate both accounts exist and belong to user
    const [fromAccount] = await db.select().from(bankAccounts)
      .where(and(eq(bankAccounts.id, validatedData.fromAccountId), eq(bankAccounts.ownerId, user.userId)))
      .limit(1);
    
    if (!fromAccount) {
      return createErrorResponse('Source account not found', 404);
    }

    const [toAccount] = await db.select().from(bankAccounts)
      .where(and(eq(bankAccounts.id, validatedData.toAccountId), eq(bankAccounts.ownerId, user.userId)))
      .limit(1);
    
    if (!toAccount) {
      return createErrorResponse('Destination account not found', 404);
    }

    // Check if source account has sufficient balance
    const currentBalance = parseFloat(fromAccount.balance);
    if (currentBalance < validatedData.amount) {
      return createErrorResponse('Insufficient balance in source account', 400);
    }

    // Create transfer transaction
    const [newTransfer] = await db.insert(transactions).values({
      description: validatedData.description,
      amount: validatedData.amount.toString(),
      type: 'transfer',
      date: validatedData.date.toISOString().split('T')[0],
      category: 'Transfer',
      ownerId: user.userId,
      accountId: validatedData.fromAccountId,
      toAccountId: validatedData.toAccountId,
    }).returning();

    // Update account balances
    await db.update(bankAccounts)
      .set({ balance: `CAST(balance AS DECIMAL) - ${validatedData.amount}` })
      .where(eq(bankAccounts.id, validatedData.fromAccountId));
      
    await db.update(bankAccounts)
      .set({ balance: `CAST(balance AS DECIMAL) + ${validatedData.amount}` })
      .where(eq(bankAccounts.id, validatedData.toAccountId));

    return createSuccessResponse({
      message: 'Transfer created successfully',
      transaction: newTransfer,
    }, 201);

  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      const errorMessage = error.errors?.[0]?.message || 'Invalid input data';
      return createErrorResponse(errorMessage, 400);
    }
    
    console.error('Create transfer error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}