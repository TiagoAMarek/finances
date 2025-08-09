import { NextRequest } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '../../lib/db';
import { creditCards } from '../../lib/schema';
import { CreditCardUpdateSchema } from '../../lib/validation';
import { getUserFromRequest, createErrorResponse, createSuccessResponse } from '../../lib/auth';

// PUT /api/credit_cards/[id] - Update credit card
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const cardId = parseInt(params.id);
    if (isNaN(cardId)) {
      return createErrorResponse('Invalid card ID', 400);
    }

    const body = await request.json();
    const validatedData = CreditCardUpdateSchema.parse(body);

    // Check if card exists and belongs to user
    const [existingCard] = await db.select().from(creditCards)
      .where(and(eq(creditCards.id, cardId), eq(creditCards.ownerId, user.userId)))
      .limit(1);

    if (!existingCard) {
      return createErrorResponse('Credit card not found', 404);
    }

    // Update card
    const updateData: Record<string, string | number> = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.limit !== undefined) updateData.limit = validatedData.limit.toString();
    if (validatedData.currentBill !== undefined) updateData.currentBill = validatedData.currentBill.toString();

    const [updatedCard] = await db.update(creditCards)
      .set(updateData)
      .where(eq(creditCards.id, cardId))
      .returning();

    return createSuccessResponse({
      message: 'Credit card updated successfully',
      card: updatedCard,
    });

  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return createErrorResponse('Invalid input data', 400);
    }
    
    console.error('Update credit card error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// DELETE /api/credit_cards/[id] - Delete credit card
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const cardId = parseInt(params.id);
    if (isNaN(cardId)) {
      return createErrorResponse('Invalid card ID', 400);
    }

    // Check if card exists and belongs to user
    const [existingCard] = await db.select().from(creditCards)
      .where(and(eq(creditCards.id, cardId), eq(creditCards.ownerId, user.userId)))
      .limit(1);

    if (!existingCard) {
      return createErrorResponse('Credit card not found', 404);
    }

    // Delete card
    await db.delete(creditCards).where(eq(creditCards.id, cardId));

    return createSuccessResponse({
      message: 'Credit card deleted successfully',
    }, 204);

  } catch (error) {
    console.error('Delete credit card error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}