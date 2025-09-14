import { z } from "zod";

import { TransactionCreateSchema, TransactionUpdateSchema } from "./api";
import { TransactionSchema } from "./entity";
import { TransactionFormSchema } from "./forms";
import { TransferCreateSchema } from "./transfers";

/**
 * Transaction Type Definitions - TypeScript Types Inferred from Zod Schemas
 * 
 * This file provides all TypeScript type definitions for transaction-related data structures.
 * All types are automatically inferred from their corresponding Zod schemas, ensuring
 * type safety and single source of truth for validation and typing.
 * 
 * Type Hierarchy and Relationships:
 * 
 * ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
 * │   TransactionForm   │────│  TransactionCreate  │────│    Transaction      │
 * │      Input          │    │       Input         │    │    (Entity)        │
 * │                     │    │                     │    │                     │
 * │ • UI Form data      │    │ • API request data  │    │ • Database record   │
 * │ • Includes helpers  │    │ • Server validation │    │ • API response data │
 * │ • Real-time valid.  │    │ • Business rules    │    │ • Includes joins    │
 * └─────────────────────┘    └─────────────────────┘    └─────────────────────┘
 *                                       │
 *                                       │ (specialized)
 *                                       ▼
 *                              ┌─────────────────────┐
 *                              │  TransferCreate     │
 *                              │     Input           │
 *                              │                     │
 *                              │ • Simplified API    │
 *                              │ • from/to naming    │
 *                              │ • Transfer-specific │
 *                              └─────────────────────┘
 * 
 * Usage Patterns:
 * 
 * 1. Forms: Use TransactionFormInput with React Hook Form
 *    - Contains UI helpers like sourceType
 *    - Real-time validation feedback
 *    - Portuguese error messages
 * 
 * 2. API Requests: Use TransactionCreateInput for POST requests
 *    - Server-side validation
 *    - Business rule enforcement  
 *    - Database integrity checks
 * 
 * 3. API Responses: Use Transaction for received data
 *    - Complete entity structure
 *    - May include joined data (categoryData)
 *    - Ready for display/processing
 * 
 * 4. Updates: Use TransactionUpdateInput for PUT requests
 *    - All fields optional except ID
 *    - Partial update support
 * 
 * 5. Transfers: Use TransferCreateInput for specialized transfer operations
 *    - Cleaner semantic naming
 *    - Transfer-specific validation
 */

// =============================================================================
// ENTITY TYPES - Database/API Response Structures
// =============================================================================

/**
 * Complete transaction entity as returned from database/API
 * 
 * Contains all transaction data including optional joined relationships.
 * This is what you receive from API endpoints and use for display.
 * 
 * @example
 * // Income transaction with category data
 * const transaction: Transaction = {
 *   id: 1,
 *   description: "Salário mensal",
 *   amount: "5000.00", 
 *   type: "income",
 *   date: "2024-01-15T00:00:00Z",
 *   categoryId: 2,
 *   categoryData: {
 *     id: 2,
 *     name: "Salário",
 *     type: "income",
 *     color: "#22c55e",
 *     icon: "salary"
 *   },
 *   ownerId: 1,
 *   accountId: 1,
 *   creditCardId: null,
 *   toAccountId: null
 * };
 */
export type Transaction = z.infer<typeof TransactionSchema>;

// =============================================================================
// INPUT TYPES - Form and API Request Structures  
// =============================================================================

/**
 * Form input type for React Hook Form integration
 * 
 * Optimized for form components with additional UI helper fields
 * and real-time validation. Use with useForm<TransactionFormInput>().
 * 
 * Key Features:
 * - sourceType field for UI state management
 * - Comprehensive business rule validation
 * - Portuguese error messages
 * - Works with FormModal components
 * 
 * @example
 * const form = useForm<TransactionFormInput>({
 *   resolver: zodResolver(TransactionFormSchema),
 *   defaultValues: {
 *     type: "expense",
 *     sourceType: "account",
 *     date: format(new Date(), "yyyy-MM-dd")
 *   }
 * });
 */
export type TransactionFormInput = z.infer<typeof TransactionFormSchema>;

/**
 * API request type for creating new transactions
 * 
 * Used for POST /api/transactions requests. Includes comprehensive
 * business rule validation and database integrity constraints.
 * 
 * @example  
 * const createTransaction = async (data: TransactionCreateInput) => {
 *   return await fetchWithAuth('/api/transactions', {
 *     method: 'POST',
 *     body: JSON.stringify(data)
 *   });
 * };
 */
export type TransactionCreateInput = z.infer<typeof TransactionCreateSchema>;

/**
 * API request type for updating existing transactions
 * 
 * Used for PUT /api/transactions/[id] requests. All fields optional
 * except ID, allowing for partial updates. Business rule validation
 * typically handled at service layer for updates.
 * 
 * @example
 * const updateTransaction = async (id: number, updates: Omit<TransactionUpdateInput, 'id'>) => {
 *   return await fetchWithAuth(`/api/transactions/${id}`, {
 *     method: 'PUT', 
 *     body: JSON.stringify({ id, ...updates })
 *   });
 * };
 */
export type TransactionUpdateInput = z.infer<typeof TransactionUpdateSchema>;

/**
 * Specialized input type for transfer operations
 * 
 * Provides cleaner semantics for transfer-specific operations with
 * fromAccountId/toAccountId naming. Can be used with dedicated
 * transfer endpoints or converted to TransactionCreateInput.
 * 
 * @example
 * const transferFunds = async (transfer: TransferCreateInput) => {
 *   // Option 1: Dedicated transfer endpoint
 *   return await fetchWithAuth('/api/transfers', {
 *     method: 'POST',
 *     body: JSON.stringify(transfer)
 *   });
 *   
 *   // Option 2: Convert to general transaction format
 *   const transactionData: TransactionCreateInput = {
 *     description: transfer.description,
 *     amount: transfer.amount,  
 *     date: transfer.date,
 *     type: 'transfer',
 *     accountId: transfer.fromAccountId,
 *     toAccountId: transfer.toAccountId,
 *     categoryId: null
 *   };
 * };
 */
export type TransferCreateInput = z.infer<typeof TransferCreateSchema>;

// =============================================================================
// TYPE GUARDS AND UTILITIES
// =============================================================================

/**
 * Type guard to check if a transaction is a transfer
 */
export const isTransfer = (transaction: Transaction): transaction is Transaction & { type: 'transfer' } => {
  return transaction.type === 'transfer';
};

/**
 * Type guard to check if a transaction uses an account (not credit card)
 */
export const usesAccount = (transaction: Transaction): transaction is Transaction & { accountId: number } => {
  return transaction.accountId !== null;
};

/**
 * Type guard to check if a transaction uses a credit card
 */
export const usesCreditCard = (transaction: Transaction): transaction is Transaction & { creditCardId: number } => {
  return transaction.creditCardId !== null;
};

/**
 * Type guard to check if transaction has category data populated
 */
export const hasCategoryData = (transaction: Transaction): transaction is Transaction & { categoryData: NonNullable<Transaction['categoryData']> } => {
  return transaction.categoryData !== undefined;
};