import { z } from "zod";

import { VALIDATION_MESSAGES, requiredMessage } from "../base/validation-helpers";

/**
 * Transfer Create Schema - Specialized Transfer Transaction Type
 * 
 * This schema provides a simplified interface specifically for transfer operations
 * between bank accounts. It uses different field names (fromAccountId/toAccountId)
 * compared to the general TransactionCreateSchema for better semantic clarity.
 * 
 * Key Features:
 * - Simplified transfer-specific API
 * - Clear semantic naming (from/to instead of source/destination)
 * - Account difference validation
 * - No category requirements (transfers are category-less)
 * 
 * Relationship to TransactionSchema:
 * This schema is typically used in specialized transfer endpoints or components,
 * while the general TransactionCreateSchema handles all transaction types including transfers.
 * 
 * Database Impact:
 * Creates two related transaction records:
 * 1. Negative amount transaction on source account (expense-like)
 * 2. Positive amount transaction on destination account (income-like)
 * 
 * API Usage:
 * POST /api/transfers (if you have a dedicated transfer endpoint)
 * 
 * @example
 * // Transfer R$ 1000 from checking to savings
 * {
 *   description: "Transferência para poupança",
 *   amount: "1000.00",
 *   date: "2024-01-15T14:30:00Z",
 *   fromAccountId: 1,    // Checking account  
 *   toAccountId: 3       // Savings account
 * }
 * 
 * // Emergency fund transfer
 * {
 *   description: "Reserva de emergência",
 *   amount: "5000.00", 
 *   date: "2024-01-20T09:00:00Z",
 *   fromAccountId: 1,    // Main account
 *   toAccountId: 4       // Emergency fund account
 * }
 */
export const TransferCreateSchema = z
  .object({
    /** 
     * Transfer description - required
     * Examples: "Transferência para poupança", "Pagamento entre contas"
     */
    description: z.string().min(1, requiredMessage("description")),
    
    /** 
     * Transfer amount - always positive decimal string
     * Represents the amount being moved from source to destination
     * Format: "1234.56" (no currency symbols)
     */
    amount: z.string().min(1, requiredMessage("amount")),
    
    /** 
     * Transfer date - ISO 8601 format
     * Used for transaction timing and balance calculations
     */
    date: z.string().min(1, requiredMessage("date")),
    
    /** 
     * Source account ID - required
     * Account from which the money is being transferred
     * Must exist in bankAccounts table and belong to the user
     */
    fromAccountId: z.number(),
    
    /** 
     * Destination account ID - required  
     * Account to which the money is being transferred
     * Must exist in bankAccounts table, belong to the user,
     * and be different from fromAccountId
     */
    toAccountId: z.number(),
  })
  // Business Rule: Source and destination accounts must be different
  .refine(
    (data) => data.fromAccountId !== data.toAccountId, 
    {
      message: VALIDATION_MESSAGES.business.sameAccount,
      path: ["toAccountId"], // Error attached to destination field
    }
  );