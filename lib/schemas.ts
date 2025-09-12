import { z } from "zod";
import { VALIDATION_MESSAGES, requiredMessage, formatMessage } from "./validation-messages";

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email(formatMessage("email")),
  password: z.string().min(1, requiredMessage("password")),
});

// API register schema (what gets sent to the API)
export const RegisterApiSchema = z.object({
  name: z.string().min(2, VALIDATION_MESSAGES.length.nameMin),
  email: z.string().email(formatMessage("email")),
  password: z
    .string()
    .min(8, VALIDATION_MESSAGES.length.passwordMin)
    .regex(/[A-Z]/, VALIDATION_MESSAGES.password.uppercase)
    .regex(/[a-z]/, VALIDATION_MESSAGES.password.lowercase)
    .regex(/[0-9]/, VALIDATION_MESSAGES.password.number)
    .regex(
      /[^A-Za-z0-9]/,
      VALIDATION_MESSAGES.password.special,
    ),
});

// Form register schema (includes confirm password for UI validation)
export const RegisterSchema = RegisterApiSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: VALIDATION_MESSAGES.password.match,
  path: ["confirmPassword"],
});

// Bank account schemas - reflecting API structure
export const BankAccountSchema = z.object({
  id: z.number(),
  name: z.string(),
  balance: z.string(), // Decimal fields come as strings from API
  currency: z.string(),
  ownerId: z.number(),
});

// API schema with defaults for server processing
export const BankAccountCreateSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.required.accountName),
  balance: z.string().min(1, requiredMessage("balance")).default("0"),
  currency: z.string().min(1, requiredMessage("currency")).default("BRL"),
});

// Form schema for react-hook-form (without defaults to keep types clean)
export const BankAccountFormSchema = z.object({
  name: z.string().min(1, requiredMessage("name")),
  balance: z.string().min(1, requiredMessage("balance")),
  currency: z.string().min(1, requiredMessage("currency")),
});

export const BankAccountUpdateSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.required.accountName).optional(),
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
  name: z.string().min(1, VALIDATION_MESSAGES.required.cardName),
  limit: z.string().min(1, requiredMessage("limit")),
  currentBill: z.string().min(1, requiredMessage("currentBill")),
});

export const CreditCardUpdateSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.required.cardName).optional(),
  limit: z.string().optional(),
  currentBill: z.string().optional(),
});

// Category schemas
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(["income", "expense", "both"]),
  color: z.string().nullable(),
  icon: z.string().nullable(),
  isDefault: z.boolean(),
  ownerId: z.number(),
  createdAt: z.string(), // ISO format string
});

export const CategoryCreateSchema = z.object({
  name: z.string().min(1, requiredMessage("name")),
  type: z.enum(["income", "expense", "both"], {
    errorMap: () => ({
      message: VALIDATION_MESSAGES.enums.categoryType,
    }),
  }),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, formatMessage("hexColor"))
    .optional(),
  icon: z.string().min(1, requiredMessage("icon")).optional(),
});

export const CategoryUpdateSchema = z.object({
  name: z.string().min(1, requiredMessage("name")).optional(),
  type: z
    .enum(["income", "expense", "both"], {
      errorMap: () => ({
        message: VALIDATION_MESSAGES.enums.categoryType,
      }),
    })
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, formatMessage("hexColor"))
    .optional(),
  icon: z.string().min(1, requiredMessage("icon")).optional(),
});

// Default category schema (for seeding)
export const DefaultCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(["income", "expense", "both"]),
  color: z.string().nullable(),
  icon: z.string().nullable(),
});

// Transaction schemas - reflecting API structure
export const TransactionSchema = z.object({
  id: z.number(),
  description: z.string(),
  amount: z.string(), // Decimal fields come as strings from API
  type: z.enum(["income", "expense", "transfer"]),
  date: z.string(), // ISO format string
  category: z.string().optional(), // Legacy field for migration compatibility
  categoryId: z.number().nullable(),
  categoryData: CategorySchema.optional(), // Category object when included in joins
  ownerId: z.number(),
  accountId: z.number().nullable(),
  creditCardId: z.number().nullable(),
  toAccountId: z.number().nullable().optional(), // For transfers
});

// Base schema for API - categoryId is required for income/expense
export const TransactionCreateSchema = z
  .object({
    description: z.string().min(1, requiredMessage("description")),
    amount: z.string().min(1, requiredMessage("amount")),
    type: z.enum(["income", "expense", "transfer"]),
    date: z.string().min(1, requiredMessage("date")),
    categoryId: z.number().optional(),
    accountId: z.number().optional(),
    creditCardId: z.number().optional(),
    toAccountId: z.number().optional(), // For transfers
  })
  .refine(
    (data) => {
      // Category is required for income and expense
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
      path: ["toAccountId"],
    },
  )
  .refine(
    (data) => {
      // For income/expense, either accountId or creditCardId is required but not both
      if (data.type !== "transfer") {
        return (
          !!(data.accountId || data.creditCardId) &&
          !(data.accountId && data.creditCardId)
        );
      }
      return true;
    },
    {
      message: VALIDATION_MESSAGES.business.singleSource,
      path: ["accountId"],
    },
  );

// Form schema for React Hook Form - includes business validation rules
export const TransactionFormSchema = z.object({
  description: z.string().min(1, requiredMessage("description")),
  amount: z.string().min(1, requiredMessage("amount")),
  type: z.enum(["income", "expense", "transfer"]),
  date: z.string().min(1, requiredMessage("date")),
  categoryId: z.number().optional(),
  accountId: z.number().optional(),
  creditCardId: z.number().optional(),
  toAccountId: z.number().optional(),
  sourceType: z.enum(["account", "creditCard"]).optional(),
})
  .refine(
    (data) => {
      // Category is required for income and expense
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
      path: ["toAccountId"],
    },
  )
  .refine(
    (data) => {
      // For income/expense, either accountId or creditCardId is required but not both
      if (data.type !== "transfer") {
        return (
          !!(data.accountId || data.creditCardId) &&
          !(data.accountId && data.creditCardId)
        );
      }
      return true;
    },
    {
      message: VALIDATION_MESSAGES.business.singleSource,
      path: ["accountId"],
    },
  );

export const TransactionUpdateSchema = z.object({
  id: z.number(),
  description: z.string().min(1, requiredMessage("description")).optional(),
  amount: z.string().optional(),
  type: z.enum(["income", "expense", "transfer"]).optional(),
  date: z.string().optional(),
  categoryId: z.number().optional(),
  accountId: z.number().optional(),
  creditCardId: z.number().optional(),
  toAccountId: z.number().optional(),
});

// Transfer schema
export const TransferCreateSchema = z
  .object({
    description: z.string().min(1, requiredMessage("description")),
    amount: z.string().min(1, requiredMessage("amount")),
    date: z.string().min(1, requiredMessage("date")),
    fromAccountId: z.number(),
    toAccountId: z.number(),
  })
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: VALIDATION_MESSAGES.business.sameAccount,
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
  name: z.string(),
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
export type Category = z.infer<typeof CategorySchema>;
export type DefaultCategory = z.infer<typeof DefaultCategorySchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type MonthlySummary = z.infer<typeof MonthlySummarySchema>;

// Input types (for forms and API requests)
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type RegisterApiInput = z.infer<typeof RegisterApiSchema>;
export type BankAccountCreateInput = z.infer<typeof BankAccountCreateSchema>;
export type BankAccountFormInput = z.infer<typeof BankAccountFormSchema>;
export type BankAccountUpdateInput = z.infer<typeof BankAccountUpdateSchema>;
export type CreditCardCreateInput = z.infer<typeof CreditCardCreateSchema>;
export type CreditCardUpdateInput = z.infer<typeof CreditCardUpdateSchema>;
export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>;
export type TransactionCreateInput = z.infer<typeof TransactionCreateSchema>;
export type TransactionFormInput = z.infer<typeof TransactionFormSchema>;
export type TransactionUpdateInput = z.infer<typeof TransactionUpdateSchema>;
export type TransferCreateInput = z.infer<typeof TransferCreateSchema>;
export type MonthlySummaryRequestInput = z.infer<
  typeof MonthlySummaryRequestSchema
>;

// Response types
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

// API Response wrappers
export interface ApiSuccessResponse<T> {
  [key: string]: T | string;
}
