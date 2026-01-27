import { eq, and, sql } from "drizzle-orm";
import { NextRequest } from "next/server";

import { VALIDATION_MESSAGES } from "@/lib/validation-messages";

import {
  getUserFromRequest,
  createErrorResponse,
  createSuccessResponse,
  handleZodError,
} from "../lib/auth";
import { db } from "../lib/db";
import { transactions, bankAccounts } from "../lib/schema";
import { TransferCreateSchema } from "../lib/validation";

// POST /api/transfers - Create transfer between accounts
export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const validatedData = TransferCreateSchema.parse(body);

    // Validate both accounts exist and belong to user
    const [fromAccount] = await db
      .select()
      .from(bankAccounts)
      .where(
        and(
          eq(bankAccounts.id, validatedData.fromAccountId),
          eq(bankAccounts.ownerId, user.userId),
        ),
      )
      .limit(1);

    if (!fromAccount) {
      return createErrorResponse("Source account not found", 404);
    }

    const [toAccount] = await db
      .select()
      .from(bankAccounts)
      .where(
        and(
          eq(bankAccounts.id, validatedData.toAccountId),
          eq(bankAccounts.ownerId, user.userId),
        ),
      )
      .limit(1);

    if (!toAccount) {
      return createErrorResponse("Destination account not found", 404);
    }

    // Create transfer transaction and update balances in a database transaction
    const newTransfer = await db.transaction(async (tx) => {
      // Check if source account has sufficient balance inside transaction
      const [account] = await tx
        .select()
        .from(bankAccounts)
        .where(eq(bankAccounts.id, validatedData.fromAccountId))
        .limit(1);
      
      if (account) {
        const currentBalance = parseFloat(account.balance);
        if (currentBalance < parseFloat(validatedData.amount)) {
          throw new Error(VALIDATION_MESSAGES.business.insufficientFunds);
        }
      }

      // Create transfer transaction
      const [transfer] = await tx
        .insert(transactions)
        .values({
          description: validatedData.description,
          amount: validatedData.amount.toString(),
          type: "transfer",
          date: validatedData.date, // Already a string in ISO format
          category: "Transfer",
          ownerId: user.userId,
          accountId: validatedData.fromAccountId,
          toAccountId: validatedData.toAccountId,
        })
        .returning();

      // Update account balances
      await tx
        .update(bankAccounts)
        .set({ balance: sql`CAST(balance AS DECIMAL) - ${validatedData.amount}` })
        .where(eq(bankAccounts.id, validatedData.fromAccountId));

      await tx
        .update(bankAccounts)
        .set({ balance: sql`CAST(balance AS DECIMAL) + ${validatedData.amount}` })
        .where(eq(bankAccounts.id, validatedData.toAccountId));

      return transfer;
    });

    return createSuccessResponse(
      {
        message: "Transfer created successfully",
        transaction: newTransfer,
      },
      201,
    );
  } catch (error) {
    const zodErrorResponse = handleZodError(error);
    if (zodErrorResponse) return zodErrorResponse;

    // Handle insufficient balance error
    if (error instanceof Error && error.message === VALIDATION_MESSAGES.business.insufficientFunds) {
      return createErrorResponse(VALIDATION_MESSAGES.business.insufficientFunds, 400);
    }

    console.error("Create transfer error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
