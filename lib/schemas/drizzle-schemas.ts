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
