import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '../lib/db';
import { creditCards } from '../lib/schema';
import { CreditCardCreateSchema } from '../lib/validation';
import { getUserFromRequest, createErrorResponse, createSuccessResponse } from '../lib/auth';

// GET /api/credit_cards - List user's credit cards
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const cards = await db.select().from(creditCards).where(eq(creditCards.ownerId, user.userId));
    
    return createSuccessResponse(cards);
  } catch (error) {
    console.error('Get credit cards error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// POST /api/credit_cards - Create new credit card
export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const body = await request.json();
    const validatedData = CreditCardCreateSchema.parse(body);

    const [newCard] = await db.insert(creditCards).values({
      name: validatedData.name,
      limit: validatedData.limit.toString(),
      currentBill: validatedData.currentBill.toString(),
      ownerId: user.userId,
    }).returning();

    return createSuccessResponse({
      message: 'Credit card created successfully',
      card: newCard,
    }, 201);

  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return createErrorResponse('Invalid input data', 400);
    }
    
    console.error('Create credit card error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}