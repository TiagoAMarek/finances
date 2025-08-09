import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '../lib/db';
import { bankAccounts } from '../lib/schema';
import { BankAccountCreateSchema } from '../lib/validation';
import { getUserFromRequest, createErrorResponse, createSuccessResponse, handleZodError } from '../lib/auth';

// GET /api/accounts - List user's bank accounts
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const accounts = await db.select().from(bankAccounts).where(eq(bankAccounts.ownerId, user.userId));
    
    return createSuccessResponse(accounts);
  } catch (error) {
    console.error('Get accounts error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// POST /api/accounts - Create new bank account
export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const body = await request.json();
    const validatedData = BankAccountCreateSchema.parse(body);

    const [newAccount] = await db.insert(bankAccounts).values({
      name: validatedData.name,
      balance: validatedData.balance.toString(),
      currency: validatedData.currency,
      ownerId: user.userId,
    }).returning();

    return createSuccessResponse({
      message: 'Account created successfully',
      account: newAccount,
    }, 201);

  } catch (error) {
    const zodErrorResponse = handleZodError(error);
    if (zodErrorResponse) return zodErrorResponse;
    
    console.error('Create account error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}