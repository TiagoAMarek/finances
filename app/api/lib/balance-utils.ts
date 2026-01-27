import { eq, sql } from "drizzle-orm";

import { TRANSACTION_TYPES } from "./constants";
import { bankAccounts, creditCards } from "./schema";

/**
 * Transaction context type from Drizzle ORM
 * 
 * Note: We use a simplified type here because Drizzle's full transaction type
 * is complex with multiple generics. The transaction context provides all the
 * standard query builder methods (select, insert, update, delete, etc.) and
 * works with any table from our schema. TypeScript will catch incorrect usage
 * at the call site.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TransactionContext = any;

interface BalanceUpdateParams {
  type: string;
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
