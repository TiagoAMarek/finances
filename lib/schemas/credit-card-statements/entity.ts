import { z } from "zod";

// Status enum for credit card statements
export const StatementStatusEnum = z.enum([
  "pending",
  "reviewed",
  "imported",
  "cancelled",
]);

// Type enum for statement line items
export const LineItemTypeEnum = z.enum([
  "purchase",
  "payment",
  "fee",
  "interest",
  "reversal",
]);

// Credit Card Statement Schema
export const CreditCardStatementSchema = z.object({
  id: z.number().int().positive(),
  creditCardId: z.number().int().positive(),
  ownerId: z.number().int().positive(),
  bankCode: z.string().min(1).max(50),
  statementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // ISO date format
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  previousBalance: z.string()
    .regex(/^\d+\.\d{2}$/, "Saldo anterior deve estar no formato 0.00")
    .refine(val => parseFloat(val) >= 0, "Saldo anterior não pode ser negativo"),
  paymentsReceived: z.string()
    .regex(/^\d+\.\d{2}$/, "Pagamentos recebidos devem estar no formato 0.00")
    .refine(val => parseFloat(val) >= 0, "Pagamentos recebidos não podem ser negativos"),
  purchases: z.string()
    .regex(/^\d+\.\d{2}$/, "Compras devem estar no formato 0.00")
    .refine(val => parseFloat(val) >= 0, "Compras não podem ser negativas"),
  fees: z.string()
    .regex(/^\d+\.\d{2}$/, "Taxas devem estar no formato 0.00")
    .refine(val => parseFloat(val) >= 0, "Taxas não podem ser negativas"),
  interest: z.string()
    .regex(/^\d+\.\d{2}$/, "Juros devem estar no formato 0.00")
    .refine(val => parseFloat(val) >= 0, "Juros não podem ser negativos"),
  totalAmount: z.string()
    .regex(/^\d+\.\d{2}$/, "Valor total deve estar no formato 0.00")
    .refine(val => parseFloat(val) >= 0, "Valor total não pode ser negativo"),
  fileName: z.string().min(1).max(255),
  fileHash: z.string().length(64), // SHA-256 hash for duplicate detection
  status: StatementStatusEnum,
  importedAt: z.string().datetime().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Statement Line Item Schema
export const StatementLineItemSchema = z.object({
  id: z.number().int().positive(),
  statementId: z.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().min(1).max(500),
  amount: z.string().regex(/^-?\d+\.\d{2}$/, "Valor deve estar no formato 0.00 ou -0.00"), // Allow negative for reversals
  type: LineItemTypeEnum,
  category: z.string().max(100).nullable().optional(), // Original from PDF
  suggestedCategoryId: z.number().int().positive().nullable().optional(), // From AI
  finalCategoryId: z.number().int().positive().nullable().optional(), // User confirmed
  transactionId: z.number().int().positive().nullable().optional(), // After import
  isDuplicate: z.boolean(),
  duplicateReason: z.string().max(255).nullable().optional(),
  rawData: z.record(z.string(), z.any()).nullable().optional(), // JSONB field
  createdAt: z.string().datetime(),
});

// Statement with line items (for API responses)
export const CreditCardStatementWithLineItemsSchema = CreditCardStatementSchema.extend({
  lineItems: z.array(StatementLineItemSchema).optional(),
});

// Statement with credit card info
export const CreditCardStatementWithCardSchema = CreditCardStatementSchema.extend({
  creditCard: z.object({
    id: z.number().int().positive(),
    name: z.string(),
    limit: z.string().regex(/^\d+\.\d{2}$/),
    currentBill: z.string().regex(/^\d+\.\d{2}$/),
  }).optional(),
});
