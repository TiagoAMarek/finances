import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";

import {
  getUserFromRequest,
  createErrorResponse,
  createSuccessResponse,
  handleZodError,
} from "../../lib/auth";
import { db } from "../../lib/db";
import { bankAccounts } from "../../lib/schema";
import { BankAccountUpdateSchema } from "../../lib/validation";

// PUT /api/accounts/[id] - Update bank account
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
    const accountId = parseInt(resolvedParams.id);
    if (isNaN(accountId)) {
      return createErrorResponse("Invalid account ID", 400);
    }

    const body = await request.json();
    const validatedData = BankAccountUpdateSchema.parse(body);

    // Check if account exists and belongs to user
    const [existingAccount] = await db
      .select()
      .from(bankAccounts)
      .where(
        and(
          eq(bankAccounts.id, accountId),
          eq(bankAccounts.ownerId, user.userId),
        ),
      )
      .limit(1);

    if (!existingAccount) {
      return createErrorResponse("Account not found", 404);
    }

    // Update account
    const updateData: Record<string, string | number> = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.balance !== undefined)
      updateData.balance = validatedData.balance.toString();
    if (validatedData.currency !== undefined)
      updateData.currency = validatedData.currency;

    const [updatedAccount] = await db
      .update(bankAccounts)
      .set(updateData)
      .where(eq(bankAccounts.id, accountId))
      .returning();

    return createSuccessResponse({
      message: "Account updated successfully",
      account: updatedAccount,
    });
  } catch (error) {
    const zodErrorResponse = handleZodError(error);
    if (zodErrorResponse) return zodErrorResponse;

    console.error("Update account error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// DELETE /api/accounts/[id] - Delete bank account
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
    const accountId = parseInt(resolvedParams.id);
    if (isNaN(accountId)) {
      return createErrorResponse("Invalid account ID", 400);
    }

    // Check if account exists and belongs to user
    const [existingAccount] = await db
      .select()
      .from(bankAccounts)
      .where(
        and(
          eq(bankAccounts.id, accountId),
          eq(bankAccounts.ownerId, user.userId),
        ),
      )
      .limit(1);

    if (!existingAccount) {
      return createErrorResponse("Account not found", 404);
    }

    // Delete account
    await db.delete(bankAccounts).where(eq(bankAccounts.id, accountId));

    return createSuccessResponse(
      {
        message: "Account deleted successfully",
      },
      204,
    );
  } catch (error) {
    console.error("Delete account error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
