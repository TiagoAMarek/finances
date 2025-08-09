import { z } from 'zod';

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Bank account schemas - reflecting API structure
export const BankAccountSchema = z.object({
  id: z.number(),
  name: z.string(),
  balance: z.string(), // Decimal fields come as strings from API
  currency: z.string(),
  ownerId: z.number(),
});

export const BankAccountCreateSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  balance: z.string().default('0'),
  currency: z.string().default('BRL'),
});

export const BankAccountUpdateSchema = z.object({
  name: z.string().min(1, 'Account name is required').optional(),
  balance: z.string().optional(),
  currency: z.string().optional(),
});

// Credit card schemas - reflecting API structure
export const CreditCardSchema = z.object({
  id: z.number(),
  name: z.string(),
  limit: z.string(), // Decimal fields come as strings from API
  currentBill: z.string(), // Decimal fields come as strings from API
  ownerId: z.number(),
});

export const CreditCardCreateSchema = z.object({
  name: z.string().min(1, 'Card name is required'),
  limit: z.string().default('0'),
  currentBill: z.string().default('0'),
});

export const CreditCardUpdateSchema = z.object({
  name: z.string().min(1, 'Card name is required').optional(),
  limit: z.string().optional(),
  currentBill: z.string().optional(),
});

// Transaction schemas - reflecting API structure
export const TransactionSchema = z.object({
  id: z.number(),
  description: z.string(),
  amount: z.string(), // Decimal fields come as strings from API
  type: z.enum(['income', 'expense', 'transfer']),
  date: z.string(), // ISO format string
  category: z.string(),
  ownerId: z.number(),
  accountId: z.number().nullable(),
  creditCardId: z.number().nullable(),
  toAccountId: z.number().nullable().optional(), // For transfers
});

export const TransactionCreateSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.string().min(1, 'Amount is required'),
  type: z.enum(['income', 'expense', 'transfer']),
  date: z.string().min(1, 'Date is required'),
  category: z.string().min(1, 'Category is required'),
  accountId: z.number().optional(),
  creditCardId: z.number().optional(),
  toAccountId: z.number().optional(), // For transfers
}).refine((data) => {
  if (data.type === 'transfer') {
    return data.accountId && data.toAccountId && data.accountId !== data.toAccountId;
  }
  return !!(data.accountId || data.creditCardId) && !(data.accountId && data.creditCardId);
}, {
  message: 'Invalid transaction configuration',
});

export const TransactionUpdateSchema = z.object({
  id: z.number(),
  description: z.string().min(1, 'Description is required').optional(),
  amount: z.string().optional(),
  type: z.enum(['income', 'expense', 'transfer']).optional(),
  date: z.string().optional(),
  category: z.string().min(1, 'Category is required').optional(),
  accountId: z.number().optional(),
  creditCardId: z.number().optional(),
  toAccountId: z.number().optional(),
});

// Transfer schema
export const TransferCreateSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.string().min(1, 'Amount is required'),
  date: z.string().min(1, 'Date is required'),
  fromAccountId: z.number(),
  toAccountId: z.number(),
}).refine((data) => data.fromAccountId !== data.toAccountId, {
  message: 'Cannot transfer to the same account',
});

// Monthly summary schema - reflecting API structure
export const MonthlySummarySchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  total_income: z.number(),
  total_expense: z.number(),
  balance: z.number(),
});

export const MonthlySummaryRequestSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
});

// User schema - reflecting API structure
export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  hashedPassword: z.string(),
});

// Response schemas
export const LoginResponseSchema = z.object({
  access_token: z.string(),
});

export const RegisterResponseSchema = z.object({
  message: z.string(),
  user: UserSchema.omit({ hashedPassword: true }),
});

export const ApiErrorResponseSchema = z.object({
  detail: z.string(),
});

// =============================================================================
// INFERRED TYPES - All types based on Zod schemas
// =============================================================================

// Entity types (API responses)
export type User = z.infer<typeof UserSchema>;
export type BankAccount = z.infer<typeof BankAccountSchema>;
export type CreditCard = z.infer<typeof CreditCardSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type MonthlySummary = z.infer<typeof MonthlySummarySchema>;

// Input types (for forms and API requests)
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type BankAccountCreateInput = z.infer<typeof BankAccountCreateSchema>;
export type BankAccountUpdateInput = z.infer<typeof BankAccountUpdateSchema>;
export type CreditCardCreateInput = z.infer<typeof CreditCardCreateSchema>;
export type CreditCardUpdateInput = z.infer<typeof CreditCardUpdateSchema>;
export type TransactionCreateInput = z.infer<typeof TransactionCreateSchema>;
export type TransactionUpdateInput = z.infer<typeof TransactionUpdateSchema>;
export type TransferCreateInput = z.infer<typeof TransferCreateSchema>;
export type MonthlySummaryRequestInput = z.infer<typeof MonthlySummaryRequestSchema>;

// Response types
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

// API Response wrappers
export interface ApiSuccessResponse<T> {
  [key: string]: T | string;
}
