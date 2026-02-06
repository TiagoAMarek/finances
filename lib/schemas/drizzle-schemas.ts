/**
 * Drizzle-Zod Schema Generation
 * 
 * This file generates Zod schemas from Drizzle ORM table definitions,
 * serving as the single source of truth for entity types.
 * 
 * Architecture:
 * ============
 * 
 * SELECT Schemas (Used):
 * - Generated from DB tables and used for entity types throughout the app
 * - Re-exported via entity.ts files (e.g., TransactionSchema, BankAccountSchema)
 * - These schemas define the shape of data read from the database/API
 * 
 * INSERT/UPDATE Schemas (Generated but not directly used):
 * - Named with "Drizzle" prefix to avoid conflicts with custom schemas
 * - Generated for completeness and potential future use
 * - Current API routes use custom schemas from api.ts files instead
 * - Custom schemas provide business logic validation, Portuguese error messages,
 *   custom validators (validAmount), and default values
 * 
 * Naming Convention:
 * ==================
 * - *SelectSchema: Used for entity types (e.g., TransactionSelectSchema)
 * - *DrizzleInsertSchema: Drizzle-generated, not used (e.g., TransactionDrizzleInsertSchema)
 * - *DrizzleUpdateSchema: Drizzle-generated, not used (e.g., TransactionDrizzleUpdateSchema)
 * - *CreateSchema: Custom business logic for API POST (e.g., TransactionCreateSchema)
 * - *UpdateSchema: Custom business logic for API PUT (e.g., TransactionUpdateSchema)
 * 
 * Why Hybrid Approach?
 * ====================
 * - Drizzle-Zod SELECT: Provides type-safe entity definitions from DB schema
 * - Custom Zod for INSERT/UPDATE: Allows complex business rules and UX requirements
 * 
 * Example:
 * --------
 * TransactionSelectSchema (drizzle-zod) → Used for Transaction type
 * TransactionCreateSchema (custom) → Used in POST /api/transactions (has business logic)
 * TransactionUpdateSchema (custom) → Used in PUT /api/transactions/[id] (has validation)
 */
import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

import {
  users,
  categories,
  defaultCategories,
  bankAccounts,
  creditCards,
  transactions,
  creditCardStatements,
  statementLineItems,
} from "@/app/api/lib/schema";

// ============================================================================
// Users
// ============================================================================
export const UserSelectSchema = createSelectSchema(users);
export const UserDrizzleInsertSchema = createInsertSchema(users);
export const UserDrizzleUpdateSchema = createUpdateSchema(users);

// ============================================================================
// Categories
// ============================================================================
export const CategorySelectSchema = createSelectSchema(categories, {
  createdAt: z.string(), // Drizzle maps timestamp to ISO string
  type: z.enum(["income", "expense", "both"]), // Enforce Enum instead of generic string
});
export const CategoryDrizzleInsertSchema = createInsertSchema(categories);
export const CategoryDrizzleUpdateSchema = createUpdateSchema(categories);

export const DefaultCategorySelectSchema = createSelectSchema(defaultCategories, {
  type: z.enum(["income", "expense", "both"]),
});
export const DefaultCategoryDrizzleInsertSchema = createInsertSchema(defaultCategories);
export const DefaultCategoryDrizzleUpdateSchema = createUpdateSchema(defaultCategories);

// ============================================================================
// Bank Accounts
// ============================================================================
export const BankAccountSelectSchema = createSelectSchema(bankAccounts);
export const BankAccountDrizzleInsertSchema = createInsertSchema(bankAccounts);
export const BankAccountDrizzleUpdateSchema = createUpdateSchema(bankAccounts);

// ============================================================================
// Credit Cards
// ============================================================================
export const CreditCardSelectSchema = createSelectSchema(creditCards);
export const CreditCardDrizzleInsertSchema = createInsertSchema(creditCards);
export const CreditCardDrizzleUpdateSchema = createUpdateSchema(creditCards);

// ============================================================================
// Transactions
// ============================================================================
export const TransactionSelectSchema = createSelectSchema(transactions, {
  toAccountId: (schema) => schema.nullable(),
  category: (schema) => schema.nullable(),
  type: z.enum(["income", "expense", "transfer"]), // Enforce Enum
  amount: z.string(), // Drizzle already maps decimal to string, but explicit doesn't hurt
  date: z.string(),   // Drizzle already maps date to string in yyyy-mm-dd format
});
export const TransactionDrizzleInsertSchema = createInsertSchema(transactions);
export const TransactionDrizzleUpdateSchema = createUpdateSchema(transactions);

// ============================================================================
// Credit Card Statements
// ============================================================================
export const CreditCardStatementSelectSchema = createSelectSchema(creditCardStatements, {
  status: z.enum(["pending", "reviewed", "imported", "cancelled"]),
  statementDate: z.string(), // Drizzle maps date to string
  dueDate: z.string(),
  previousBalance: z.string(),
  paymentsReceived: z.string(),
  purchases: z.string(),
  fees: z.string(),
  interest: z.string(),
  totalAmount: z.string(),
  importedAt: (schema) => schema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const CreditCardStatementDrizzleInsertSchema = createInsertSchema(creditCardStatements);
export const CreditCardStatementDrizzleUpdateSchema = createUpdateSchema(creditCardStatements);

// ============================================================================
// Statement Line Items
// ============================================================================
export const StatementLineItemSelectSchema = createSelectSchema(statementLineItems, {
  type: z.enum(["purchase", "payment", "fee", "interest", "reversal"]),
  date: z.string(),
  amount: z.string(),
  category: (schema) => schema.nullable(),
  suggestedCategoryId: (schema) => schema.nullable(),
  finalCategoryId: (schema) => schema.nullable(),
  transactionId: (schema) => schema.nullable(),
  duplicateReason: (schema) => schema.nullable(),
  rawData: (_schema) => z.record(z.string(), z.any()).nullable(),
  createdAt: z.string(),
});
export const StatementLineItemDrizzleInsertSchema = createInsertSchema(statementLineItems);
export const StatementLineItemDrizzleUpdateSchema = createUpdateSchema(statementLineItems);

// ============================================================================
// Inferred Types - Convenience exports for type usage throughout the app
// ============================================================================
export type User = z.infer<typeof UserSelectSchema>;
export type Category = z.infer<typeof CategorySelectSchema>;
export type DefaultCategory = z.infer<typeof DefaultCategorySelectSchema>;
export type BankAccount = z.infer<typeof BankAccountSelectSchema>;
export type CreditCard = z.infer<typeof CreditCardSelectSchema>;
export type Transaction = z.infer<typeof TransactionSelectSchema>;
export type CreditCardStatement = z.infer<typeof CreditCardStatementSelectSchema>;
export type StatementLineItem = z.infer<typeof StatementLineItemSelectSchema>;

