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
import {
  transactions,
  bankAccounts,
  creditCards,
  categories,
} from "../lib/schema";
import { TransactionCreateSchema } from "../lib/validation";

// GET /api/transactions - List user's transactions
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const userTransactions = await db
      .select({
        id: transactions.id,
        description: transactions.description,
        amount: transactions.amount,
        type: transactions.type,
        date: transactions.date,
        category: transactions.category, // Legacy field
        categoryId: transactions.categoryId,
        ownerId: transactions.ownerId,
        accountId: transactions.accountId,
        creditCardId: transactions.creditCardId,
        toAccountId: transactions.toAccountId,
        categoryData: {
          id: categories.id,
          name: categories.name,
          type: categories.type,
          color: categories.color,
          icon: categories.icon,
          isDefault: categories.isDefault,
          ownerId: categories.ownerId,
          createdAt: categories.createdAt,
        },
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(eq(transactions.ownerId, user.userId))
      .orderBy(sql`${transactions.date} DESC`);

    return createSuccessResponse(userTransactions);
  } catch (error) {
    console.error("Get transactions error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// POST /api/transactions - Create new transaction
export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const validatedData = TransactionCreateSchema.parse(body);

    // Validate category ownership and type compatibility for non-transfer transactions
    if (validatedData.type !== "transfer" && validatedData.categoryId) {
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

      // Validate category type compatibility with transaction type
      if (category.type !== "both" && category.type !== validatedData.type) {
        return createErrorResponse(
          "Tipo de categoria incompatível com o tipo de transação",
          400,
        );
      }
    }

    // Validate account/credit card ownership
    if (validatedData.accountId) {
      const [account] = await db
        .select()
        .from(bankAccounts)
        .where(
          and(
            eq(bankAccounts.id, validatedData.accountId),
            eq(bankAccounts.ownerId, user.userId),
          ),
        )
        .limit(1);

      if (!account) {
        return createErrorResponse("Account not found", 404);
      }
    }

    if (validatedData.creditCardId) {
      const [card] = await db
        .select()
        .from(creditCards)
        .where(
          and(
            eq(creditCards.id, validatedData.creditCardId),
            eq(creditCards.ownerId, user.userId),
          ),
        )
        .limit(1);

      if (!card) {
        return createErrorResponse("Credit card not found", 404);
      }
    }

    // Validate transfer accounts
    if (validatedData.type === "transfer" && validatedData.toAccountId) {
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
    }

    // Create transaction and update balances in a database transaction
    const newTransaction = await db.transaction(async (tx) => {
      // Check for insufficient balance on expense transactions inside transaction
      if (validatedData.type === "expense" && validatedData.accountId) {
        const [account] = await tx
          .select()
          .from(bankAccounts)
          .where(eq(bankAccounts.id, validatedData.accountId))
          .limit(1);
        
        if (account) {
          const currentBalance = parseFloat(account.balance);
          const amount = parseFloat(validatedData.amount);
          if (currentBalance < amount) {
            throw new Error(VALIDATION_MESSAGES.business.insufficientFunds);
          }
        }
      }

      // Create transaction
      const [transaction] = await tx
        .insert(transactions)
        .values({
          description: validatedData.description,
          amount: validatedData.amount.toString(),
          type: validatedData.type,
          date: validatedData.date, // Already a string in ISO format
          categoryId: validatedData.categoryId,
          ownerId: user.userId,
          accountId: validatedData.accountId || null,
          creditCardId: validatedData.creditCardId || null,
          toAccountId: validatedData.toAccountId || null,
        })
        .returning();

      // Update account balances for non-transfer transactions
      if (validatedData.type !== "transfer") {
        if (validatedData.accountId) {
          const balanceChange =
            validatedData.type === "income"
              ? validatedData.amount
              : -validatedData.amount;
          await tx
            .update(bankAccounts)
            .set({ balance: sql`CAST(balance AS DECIMAL) + ${balanceChange}` })
            .where(eq(bankAccounts.id, validatedData.accountId));
        }

        if (validatedData.creditCardId) {
          // For credit card, only expenses increase the bill
          if (validatedData.type === "expense") {
            await tx
              .update(creditCards)
              .set({
                currentBill: sql`CAST(current_bill AS DECIMAL) + ${validatedData.amount}`,
              })
              .where(eq(creditCards.id, validatedData.creditCardId));
          }
        }
      } else {
        // Handle transfer: decrease from account, increase to account
        if (validatedData.accountId && validatedData.toAccountId) {
          await tx
            .update(bankAccounts)
            .set({
              balance: sql`CAST(balance AS DECIMAL) - ${validatedData.amount}`,
            })
            .where(eq(bankAccounts.id, validatedData.accountId));

          await tx
            .update(bankAccounts)
            .set({
              balance: sql`CAST(balance AS DECIMAL) + ${validatedData.amount}`,
            })
            .where(eq(bankAccounts.id, validatedData.toAccountId));
        }
      }

      return transaction;
    });

    return createSuccessResponse(
      {
        message: "Transação criada com sucesso",
        transaction: newTransaction,
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

    console.error("Create transaction error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
