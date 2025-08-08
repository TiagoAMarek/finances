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

// Bank account schemas
export const BankAccountCreateSchema = z.object({
  name: z.string().min(1, 'Account name is required'),
  balance: z.number().default(0),
  currency: z.string().default('BRL'),
});

export const BankAccountUpdateSchema = z.object({
  name: z.string().min(1, 'Account name is required').optional(),
  balance: z.number().optional(),
  currency: z.string().optional(),
});

// Credit card schemas
export const CreditCardCreateSchema = z.object({
  name: z.string().min(1, 'Card name is required'),
  limit: z.number().min(0, 'Limit must be positive').default(0),
  currentBill: z.number().default(0),
});

export const CreditCardUpdateSchema = z.object({
  name: z.string().min(1, 'Card name is required').optional(),
  limit: z.number().min(0, 'Limit must be positive').optional(),
  currentBill: z.number().optional(),
});

// Transaction schemas
export const TransactionCreateSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense', 'transfer']),
  date: z.string().transform((str) => new Date(str)),
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
  amount: z.number().positive('Amount must be positive').optional(),
  type: z.enum(['income', 'expense', 'transfer']).optional(),
  date: z.string().transform((str) => new Date(str)).optional(),
  category: z.string().min(1, 'Category is required').optional(),
  accountId: z.number().optional(),
  creditCardId: z.number().optional(),
  toAccountId: z.number().optional(),
});

// Transfer schema
export const TransferCreateSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  date: z.string().transform((str) => new Date(str)),
  fromAccountId: z.number(),
  toAccountId: z.number(),
}).refine((data) => data.fromAccountId !== data.toAccountId, {
  message: 'Cannot transfer to the same account',
});

// Monthly summary schema
export const MonthlySummarySchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
});

// Types
export type LoginData = z.infer<typeof LoginSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
export type BankAccountCreateData = z.infer<typeof BankAccountCreateSchema>;
export type BankAccountUpdateData = z.infer<typeof BankAccountUpdateSchema>;
export type CreditCardCreateData = z.infer<typeof CreditCardCreateSchema>;
export type CreditCardUpdateData = z.infer<typeof CreditCardUpdateSchema>;
export type TransactionCreateData = z.infer<typeof TransactionCreateSchema>;
export type TransactionUpdateData = z.infer<typeof TransactionUpdateSchema>;
export type TransferCreateData = z.infer<typeof TransferCreateSchema>;
export type MonthlySummaryData = z.infer<typeof MonthlySummarySchema>;