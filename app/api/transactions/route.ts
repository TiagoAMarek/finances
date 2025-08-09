import { NextRequest } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '../lib/db';
import { transactions, bankAccounts, creditCards } from '../lib/schema';
import { TransactionCreateSchema } from '../lib/validation';
import { getUserFromRequest, createErrorResponse, createSuccessResponse, handleZodError } from '../lib/auth';

// GET /api/transactions - List user's transactions
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const userTransactions = await db.select().from(transactions).where(eq(transactions.ownerId, user.userId));
    
    return createSuccessResponse(userTransactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// POST /api/transactions - Create new transaction
export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const body = await request.json();
    const validatedData = TransactionCreateSchema.parse(body);

    // Validate account/credit card ownership
    if (validatedData.accountId) {
      const [account] = await db.select().from(bankAccounts)
        .where(and(eq(bankAccounts.id, validatedData.accountId), eq(bankAccounts.ownerId, user.userId)))
        .limit(1);
      
      if (!account) {
        return createErrorResponse('Account not found', 404);
      }
    }

    if (validatedData.creditCardId) {
      const [card] = await db.select().from(creditCards)
        .where(and(eq(creditCards.id, validatedData.creditCardId), eq(creditCards.ownerId, user.userId)))
        .limit(1);
      
      if (!card) {
        return createErrorResponse('Credit card not found', 404);
      }
    }

    // Validate transfer accounts
    if (validatedData.type === 'transfer' && validatedData.toAccountId) {
      const [toAccount] = await db.select().from(bankAccounts)
        .where(and(eq(bankAccounts.id, validatedData.toAccountId), eq(bankAccounts.ownerId, user.userId)))
        .limit(1);
      
      if (!toAccount) {
        return createErrorResponse('Destination account not found', 404);
      }
    }

    // Create transaction
    const [newTransaction] = await db.insert(transactions).values({
      description: validatedData.description,
      amount: validatedData.amount.toString(),
      type: validatedData.type,
      date: validatedData.date, // Already a string in ISO format
      category: validatedData.category,
      ownerId: user.userId,
      accountId: validatedData.accountId || null,
      creditCardId: validatedData.creditCardId || null,
      toAccountId: validatedData.toAccountId || null,
    }).returning();

    // Update account balances for non-transfer transactions
    if (validatedData.type !== 'transfer') {
      if (validatedData.accountId) {
        const balanceChange = validatedData.type === 'income' ? validatedData.amount : -validatedData.amount;
        await db.update(bankAccounts)
          .set({ balance: `CAST(balance AS DECIMAL) + ${balanceChange}` })
          .where(eq(bankAccounts.id, validatedData.accountId));
      }
      
      if (validatedData.creditCardId) {
        // For credit card, only expenses increase the bill
        if (validatedData.type === 'expense') {
          await db.update(creditCards)
            .set({ currentBill: `CAST(current_bill AS DECIMAL) + ${validatedData.amount}` })
            .where(eq(creditCards.id, validatedData.creditCardId));
        }
      }
    } else {
      // Handle transfer: decrease from account, increase to account
      if (validatedData.accountId && validatedData.toAccountId) {
        await db.update(bankAccounts)
          .set({ balance: `CAST(balance AS DECIMAL) - ${validatedData.amount}` })
          .where(eq(bankAccounts.id, validatedData.accountId));
          
        await db.update(bankAccounts)
          .set({ balance: `CAST(balance AS DECIMAL) + ${validatedData.amount}` })
          .where(eq(bankAccounts.id, validatedData.toAccountId));
      }
    }

    return createSuccessResponse({
      message: 'Transaction created successfully',
      transaction: newTransaction,
    }, 201);

  } catch (error) {
    const zodErrorResponse = handleZodError(error);
    if (zodErrorResponse) return zodErrorResponse;
    
    console.error('Create transaction error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}