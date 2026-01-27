import { z } from "zod";

import { VALIDATION_MESSAGES, requiredMessage, validAmount } from "../base/validation-helpers";

/**
 * Transaction Create API Schema - Server-Side Validation
 * 
 * Used for validating incoming transaction creation requests to the API.
 * Enforces all business rules and data integrity constraints before
 * persisting transactions to the database.
 * 
 * Key Features:
 * - Comprehensive business rule validation
 * - Portuguese error messages for API responses
 * - Strict type enforcement for financial data
 * - Account balance and relationship validation preparation
 * 
 * Business Rules Enforced:
 * 1. Category is required for income/expense transactions
 * 2. Transfers require both source and destination accounts (different)
 * 3. Income/expense requires exactly one source (account XOR credit card)
 * 
 * API Usage:
 * POST /api/transactions
 * 
 * @example
 * // Valid expense transaction
 * {
 *   description: "Compra no supermercado",
 *   amount: "150.75",
 *   type: "expense",
 *   date: "2024-01-15T10:30:00Z",
 *   categoryId: 5,        // Required for expense
 *   accountId: 1,         // Source account
 *   creditCardId: null    // Mutually exclusive
 * }
 * 
 * // Valid transfer transaction
 * {
 *   description: "Transferência para poupança",
 *   amount: "2000.00",
 *   type: "transfer",
 *   date: "2024-01-16T14:00:00Z",
 *   categoryId: null,     // Not used for transfers
 *   accountId: 1,         // Source account
 *   toAccountId: 3        // Destination account (different from source)
 * }
 */
export const TransactionCreateSchema = z
  .object({
    /** Transaction description - required, user-facing memo */
    description: z.string().min(1, requiredMessage("description")),
    
    /** 
     * Amount as decimal string - always positive
     * Format: "1234.56" (no currency symbols)
     * Precision handled by decimal type in database
     */
    amount: validAmount("amount"),
    
    /** Transaction type - determines validation and processing logic */
    type: z.enum(["income", "expense", "transfer"]),
    
    /** 
     * Transaction date - ISO 8601 format
     * Used for: reporting, filtering, balance calculations
     */
    date: z.string().min(1, requiredMessage("date")),
    
    /** 
     * Category ID - conditionally required
     * Must exist in categories table and belong to transaction owner
     * Required for income/expense, ignored for transfers
     */
    categoryId: z.number().optional(),
    
    /** 
     * Source account ID - conditionally required  
     * Must exist in bankAccounts table and belong to transaction owner
     * For transfers: source account, For income/expense: affected account
     */
    accountId: z.number().optional(),
    
    /** 
     * Credit card ID - conditionally required
     * Must exist in creditCards table and belong to transaction owner
     * Only for income/expense, mutually exclusive with accountId
     */
    creditCardId: z.number().optional(),
    
    /** 
     * Destination account ID - only for transfers
     * Must exist in bankAccounts table, belong to owner, differ from accountId
     */
    toAccountId: z.number().optional(),
  })
  // Business Rule Validation 1: Categories for Income/Expense
  .refine(
    (data) => {
      // Income and expense transactions must have a category
      if (data.type !== "transfer" && !data.categoryId) {
        return false;
      }
      return true;
    },
    {
      message: VALIDATION_MESSAGES.business.categoryRequired,
      path: ["categoryId"],
    },
  )
  // Business Rule Validation 2: Transfer Account Requirements  
  .refine(
    (data) => {
      if (data.type === "transfer") {
        // Transfers must have both accounts and they must be different
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
      path: ["toAccountId"],
    },
  )
  // Business Rule Validation 3: Source Exclusivity for Income/Expense
  .refine(
    (data) => {
      if (data.type !== "transfer") {
        // Must have exactly one source: account OR credit card (XOR)
        const hasAccount = !!data.accountId;
        const hasCreditCard = !!data.creditCardId;
        return hasAccount !== hasCreditCard;
      }
      return true;
    },
    {
      message: VALIDATION_MESSAGES.business.singleSource,
      path: ["accountId"],
    },
  );

/**
 * Transaction Update API Schema - Partial Updates
 * 
 * Used for validating transaction update requests to the API.
 * All fields are optional except ID, allowing for partial updates.
 * 
 * Note: Business rule validation is typically handled at the service layer
 * for updates, as the validation context depends on the current transaction state.
 * 
 * API Usage:
 * PUT /api/transactions/[id]
 * 
 * @example
 * // Update only description and amount
 * {
 *   id: 123,
 *   description: "Compra no supermercado - atualizado",
 *   amount: "175.50"
 * }
 * 
 * // Change transaction type (requires validation at service layer)
 * {
 *   id: 123, 
 *   type: "income",
 *   categoryId: 8
 * }
 */
export const TransactionUpdateSchema = z.object({
  /** Transaction ID - required for identifying the record to update */
  id: z.number(),
  
  /** Optional description update */
  description: z.string().min(1, requiredMessage("description")).optional(),
  
  /** Optional amount update - must be valid decimal string */
  amount: validAmount("amount").optional(),
  
  /** Optional type change - requires service-layer validation */
  type: z.enum(["income", "expense", "transfer"]).optional(),
  
  /** Optional date change */
  date: z.string().optional(),
  
  /** Optional category change - service validates category ownership */
  categoryId: z.number().optional(),
  
  /** Optional account change - service validates account ownership */
  accountId: z.number().optional(),
  
  /** Optional credit card change - service validates card ownership */
  creditCardId: z.number().optional(),
  
  /** Optional destination account change - for transfers */
  toAccountId: z.number().optional(),
});