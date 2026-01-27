import { eq, sql } from "drizzle-orm";

import { TRANSACTION_TYPES, TransactionType } from "./constants";
import { db } from "./db";
import { bankAccounts, creditCards } from "./schema";

/**
 * Transaction context type from Drizzle ORM
 * 
 * Inferred from the actual database transaction type to ensure type safety
 * while avoiding complex generic type definitions.
 */
type TransactionContext = Parameters<Parameters<typeof db.transaction>[0]>[0];

interface BalanceUpdateParams {
  type: TransactionType;
  amount: number | string;
  accountId: number | null;
  creditCardId: number | null;
  toAccountId?: number | null;
}

/**
 * Apply balance changes for a transaction (create or restore after deletion)
 * Consolidates duplicate balance logic across POST and PUT/DELETE operations
 */
export async function applyBalanceChanges(
  tx: TransactionContext,
  params: BalanceUpdateParams,
): Promise<void> {
  const amount = typeof params.amount === "string" ? parseFloat(params.amount) : params.amount;

  // Validate amount is a valid number
  if (isNaN(amount)) {
    throw new Error("Invalid amount value");
  }

  if (params.type !== TRANSACTION_TYPES.TRANSFER) {
    // Handle non-transfer transactions
    if (params.accountId) {
      const balanceChange =
        params.type === TRANSACTION_TYPES.INCOME ? amount : -amount;
      await tx
        .update(bankAccounts)
        .set({ balance: sql`CAST(balance AS DECIMAL) + ${balanceChange}` })
        .where(eq(bankAccounts.id, params.accountId));
    }

    if (params.creditCardId && params.type === TRANSACTION_TYPES.EXPENSE) {
      await tx
        .update(creditCards)
        .set({
          currentBill: sql`CAST(current_bill AS DECIMAL) + ${amount}`,
        })
        .where(eq(creditCards.id, params.creditCardId));
    }
  } else {
    // Handle transfers: decrease from account, increase to account
    if (params.accountId && params.toAccountId) {
      await tx
        .update(bankAccounts)
        .set({
          balance: sql`CAST(balance AS DECIMAL) - ${amount}`,
        })
        .where(eq(bankAccounts.id, params.accountId));

      await tx
        .update(bankAccounts)
        .set({
          balance: sql`CAST(balance AS DECIMAL) + ${amount}`,
        })
        .where(eq(bankAccounts.id, params.toAccountId));
    }
  }
}

/**
 * Reverse balance changes for a transaction (for updates or deletions)
 * Consolidates duplicate balance reversal logic
 */
export async function reverseBalanceChanges(
  tx: TransactionContext,
  params: BalanceUpdateParams,
): Promise<void> {
  const amount = typeof params.amount === "string" ? parseFloat(params.amount) : params.amount;

  // Validate amount is a valid number
  if (isNaN(amount)) {
    throw new Error("Invalid amount value");
  }

  if (params.type !== TRANSACTION_TYPES.TRANSFER) {
    // Reverse non-transfer transactions
    if (params.accountId) {
      const balanceChange =
        params.type === TRANSACTION_TYPES.INCOME ? -amount : amount;
      await tx
        .update(bankAccounts)
        .set({ balance: sql`CAST(balance AS DECIMAL) + ${balanceChange}` })
        .where(eq(bankAccounts.id, params.accountId));
    }

    if (params.creditCardId && params.type === TRANSACTION_TYPES.EXPENSE) {
      await tx
        .update(creditCards)
        .set({
          currentBill: sql`CAST(current_bill AS DECIMAL) - ${amount}`,
        })
        .where(eq(creditCards.id, params.creditCardId));
    }
  } else {
    // Reverse transfer: add back to source, subtract from destination
    if (params.accountId && params.toAccountId) {
      await tx
        .update(bankAccounts)
        .set({
          balance: sql`CAST(balance AS DECIMAL) + ${amount}`,
        })
        .where(eq(bankAccounts.id, params.accountId));

      await tx
        .update(bankAccounts)
        .set({
          balance: sql`CAST(balance AS DECIMAL) - ${amount}`,
        })
        .where(eq(bankAccounts.id, params.toAccountId));
    }
  }
}
