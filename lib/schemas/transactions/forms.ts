import { z } from "zod";
import { VALIDATION_MESSAGES, requiredMessage } from "../base/validation-helpers";

/**
 * Transaction Form Schema - React Hook Form Integration
 * 
 * Designed specifically for form validation with React Hook Form.
 * Includes comprehensive business logic validation to ensure data integrity
 * and provide real-time form validation feedback to users.
 * 
 * Key Features:
 * - Real-time validation for form state management
 * - Business rule enforcement (category requirements, account exclusions)
 * - Portuguese error messages for user-friendly feedback
 * - Conditional validation based on transaction type
 * 
 * @example
 * // Income transaction form data
 * {
 *   description: "Salário mensal",
 *   amount: "5000.00",
 *   type: "income",
 *   date: "2024-01-15",
 *   categoryId: 2,           // Required for income
 *   accountId: 1,            // Either accountId OR creditCardId
 *   creditCardId: undefined, // Mutually exclusive with accountId
 *   sourceType: "account"    // UI helper for form selection
 * }
 * 
 * // Transfer transaction form data
 * {
 *   description: "Transferência entre contas",
 *   amount: "1000.00",
 *   type: "transfer",
 *   date: "2024-01-16",
 *   categoryId: undefined,   // Not used for transfers
 *   accountId: 1,            // Source account (required)
 *   toAccountId: 2,          // Destination account (required, different from source)
 *   sourceType: "account"
 * }
 */
export const TransactionFormSchema = z.object({
  /** 
   * Transaction description - required, user-friendly memo
   * Examples: "Compra no supermercado", "Pagamento de conta de luz"
   */
  description: z.string().min(1, requiredMessage("description")),

  /** 
   * Transaction amount - required decimal string
   * Format: "1234.56" (no currency symbols, always positive)
   * Direction determined by transaction type
   */
  amount: z.string().min(1, requiredMessage("amount")),

  /** 
   * Transaction type - determines validation rules and UI behavior
   * - "income": Requires categoryId + (accountId OR creditCardId)
   * - "expense": Requires categoryId + (accountId OR creditCardId)
   * - "transfer": Requires accountId + toAccountId (different accounts)
   */
  type: z.enum(["income", "expense", "transfer"]),

  /** 
   * Transaction date - required ISO date string
   * Format: "2024-01-15" (date inputs provide this format)
   */
  date: z.string().min(1, requiredMessage("date")),

  /** 
   * Category ID - conditionally required
   * - Required for income/expense transactions
   * - Not used for transfer transactions
   * - Validation enforced by business rules below
   */
  categoryId: z.number().optional(),

  /** 
   * Bank account ID - conditionally required
   * - For income/expense: source/destination account
   * - For transfers: source account (must be different from toAccountId)
   * - Mutually exclusive with creditCardId for income/expense
   */
  accountId: z.number().optional(),

  /** 
   * Credit card ID - conditionally required
   * - Only for income/expense transactions
   * - Mutually exclusive with accountId
   * - Not used for transfers
   */
  creditCardId: z.number().optional(),

  /** 
   * Destination account ID - only for transfers
   * - Required for transfer transactions
   * - Must be different from accountId
   * - Not used for income/expense
   */
  toAccountId: z.number().optional(),

  /** 
   * UI helper field - not persisted to database
   * Helps form components determine which source type is selected
   * - "account": Use accountId for the transaction
   * - "creditCard": Use creditCardId for the transaction
   */
  sourceType: z.enum(["account", "creditCard"]).optional(),
})
  // Business Rule 1: Category is required for income/expense transactions
  .refine(
    (data) => {
      if (data.type !== "transfer" && !data.categoryId) {
        return false;
      }
      return true;
    },
    {
      message: VALIDATION_MESSAGES.business.categoryRequired,
      path: ["categoryId"], // Error will be attached to categoryId field
    },
  )
  // Business Rule 2: Transfers require both accounts and they must be different
  .refine(
    (data) => {
      if (data.type === "transfer") {
        return (
          data.accountId &&
          data.toAccountId &&
          data.accountId !== data.toAccountId
        );
      }
      return true;
    },
    {
      message: VALIDATION_MESSAGES.business.transferAccounts,
      path: ["toAccountId"], // Error will be attached to toAccountId field
    },
  )
  // Business Rule 3: Income/expense requires exactly one source (account OR credit card)
  .refine(
    (data) => {
      if (data.type !== "transfer") {
        // Must have either accountId or creditCardId, but not both
        const hasAccount = !!data.accountId;
        const hasCreditCard = !!data.creditCardId;
        return hasAccount !== hasCreditCard; // XOR operation
      }
      return true;
    },
    {
      message: VALIDATION_MESSAGES.business.singleSource,
      path: ["accountId"], // Error will be attached to accountId field
    },
  );
