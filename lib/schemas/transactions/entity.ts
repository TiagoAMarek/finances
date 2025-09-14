import { z } from "zod";

import { CategorySchema } from "../categories/entity";

/**
 * Transaction Entity Schema - Core API Response Structure
 * 
 * Represents a financial transaction as returned from the database/API.
 * Transactions can be one of three types: income, expense, or transfer.
 * 
 * @example
 * // Income transaction
 * {
 *   id: 1,
 *   description: "Salário mensal",
 *   amount: "5000.00",
 *   type: "income",
 *   date: "2024-01-15T00:00:00Z",
 *   categoryId: 2,
 *   categoryData: { name: "Salário", type: "income", ... },
 *   ownerId: 1,
 *   accountId: 1,
 *   creditCardId: null,
 *   toAccountId: null
 * }
 * 
 * // Transfer transaction
 * {
 *   id: 2,
 *   description: "Transferência entre contas",
 *   amount: "1000.00",
 *   type: "transfer",
 *   date: "2024-01-16T00:00:00Z",
 *   categoryId: null,
 *   ownerId: 1,
 *   accountId: 1,      // Source account
 *   toAccountId: 2     // Destination account
 * }
 */
export const TransactionSchema = z.object({
  /** Unique transaction identifier */
  id: z.number(),

  /** Transaction description/memo (e.g., "Compra no supermercado", "Transferência entre contas") */
  description: z.string(),

  /** 
   * Transaction amount as decimal string for precision
   * Always positive - direction is determined by transaction type
   * Format: "1234.56" (no currency symbols)
   */
  amount: z.string(),

  /** 
   * Transaction type:
   * - "income": Money coming in (requires categoryId, accountId OR creditCardId)
   * - "expense": Money going out (requires categoryId, accountId OR creditCardId)  
   * - "transfer": Money moved between accounts (requires accountId AND toAccountId)
   */
  type: z.enum(["income", "expense", "transfer"]),

  /** Transaction date in ISO 8601 format (e.g., "2024-01-15T00:00:00Z") */
  date: z.string(),

  /** 
   * @deprecated Legacy category field for backward compatibility
   * Use categoryId instead
   */
  category: z.string().optional(),

  /** 
   * Category ID for income/expense transactions
   * - Required for income/expense types
   * - null for transfer types
   */
  categoryId: z.number().nullable(),

  /** 
   * Populated category object when transaction includes category joins
   * Contains full category details (name, type, color, icon, etc.)
   * Only present in API responses that explicitly include category data
   */
  categoryData: CategorySchema.optional(),

  /** ID of the user who owns this transaction */
  ownerId: z.number(),

  /** 
   * Bank account ID for the transaction
   * - For income/expense: the account being credited/debited
   * - For transfers: the source account
   * - Mutually exclusive with creditCardId for income/expense
   */
  accountId: z.number().nullable(),

  /** 
   * Credit card ID for income/expense transactions
   * - Only used for income/expense types
   * - Mutually exclusive with accountId
   * - null for transfer types
   */
  creditCardId: z.number().nullable(),

  /** 
   * Destination account ID for transfer transactions
   * - Only used for transfer types
   * - Must be different from accountId
   * - null for income/expense types
   */
  toAccountId: z.number().nullable().optional(),
});
