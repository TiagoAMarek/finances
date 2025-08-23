import { z } from "zod";

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

// API register schema (what gets sent to the API)
export const RegisterApiSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Formato de email inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "Senha deve conter pelo menos um número")
    .regex(
      /[^A-Za-z0-9]/,
      "Senha deve conter pelo menos um caractere especial",
    ),
});

// Form register schema (includes confirm password for UI validation)
export const RegisterSchema = RegisterApiSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
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

export const BankAccountCreateSchema = z.object({
  name: z.string().min(1, "Nome da conta é obrigatório"),
  balance: z.string().default("0"),
  currency: z.string().default("BRL"),
});

export const BankAccountUpdateSchema = z.object({
  name: z.string().min(1, "Nome da conta é obrigatório").optional(),
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
  name: z.string().min(1, "Nome do cartão é obrigatório"),
  limit: z.string().default("0"),
  currentBill: z.string().default("0"),
});

export const CreditCardUpdateSchema = z.object({
  name: z.string().min(1, "Nome do cartão é obrigatório").optional(),
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
  name: z.string().min(1, "Nome da categoria é obrigatório"),
  type: z.enum(["income", "expense", "both"], {
    errorMap: () => ({
      message: "Tipo deve ser 'income', 'expense' ou 'both'",
    }),
  }),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar no formato hexadecimal")
    .optional(),
  icon: z.string().min(1, "Ícone é obrigatório").optional(),
});

export const CategoryUpdateSchema = z.object({
  name: z.string().min(1, "Nome da categoria é obrigatório").optional(),
  type: z
    .enum(["income", "expense", "both"], {
      errorMap: () => ({
        message: "Tipo deve ser 'income', 'expense' ou 'both'",
      }),
    })
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, "Cor deve estar no formato hexadecimal")
    .optional(),
  icon: z.string().min(1, "Ícone é obrigatório").optional(),
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

export const TransactionCreateSchema = z
  .object({
    description: z.string().min(1, "Descrição é obrigatória"),
    amount: z.string().min(1, "Valor é obrigatório"),
    type: z.enum(["income", "expense", "transfer"]),
    date: z.string().min(1, "Data é obrigatória"),
    categoryId: z.number({ required_error: "Categoria é obrigatória" }),
    accountId: z.number().optional(),
    creditCardId: z.number().optional(),
    toAccountId: z.number().optional(), // For transfers
  })
  .refine(
    (data) => {
      if (data.type === "transfer") {
        return (
          data.accountId &&
          data.toAccountId &&
          data.accountId !== data.toAccountId
        );
      }
      return (
        !!(data.accountId || data.creditCardId) &&
        !(data.accountId && data.creditCardId)
      );
    },
    {
      message: "Configuração de transação inválida",
    },
  );

export const TransactionUpdateSchema = z.object({
  id: z.number(),
  description: z.string().min(1, "Descrição é obrigatória").optional(),
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
    description: z.string().min(1, "Descrição é obrigatória"),
    amount: z.string().min(1, "Valor é obrigatório"),
    date: z.string().min(1, "Data é obrigatória"),
    fromAccountId: z.number(),
    toAccountId: z.number(),
  })
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: "Não é possível transferir para a mesma conta",
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
export type BankAccountUpdateInput = z.infer<typeof BankAccountUpdateSchema>;
export type CreditCardCreateInput = z.infer<typeof CreditCardCreateSchema>;
export type CreditCardUpdateInput = z.infer<typeof CreditCardUpdateSchema>;
export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>;
export type TransactionCreateInput = z.infer<typeof TransactionCreateSchema>;
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
