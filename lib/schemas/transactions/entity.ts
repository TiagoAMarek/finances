import { CategorySchema } from "../categories/entity";
import { TransactionSelectSchema } from "../drizzle-schemas";

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
export const TransactionSchema = TransactionSelectSchema.extend({
  /** 
   * Populated category object when transaction includes category joins
   * Contains full category details (name, type, color, icon, etc.)
   * Only present in API responses that explicitly include category data
   */
  categoryData: CategorySchema.optional(),
});
