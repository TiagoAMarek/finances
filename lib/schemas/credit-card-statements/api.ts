import { z } from "zod";

import { validAmount } from "@/lib/schemas/base/validation-helpers";
import { VALIDATION_MESSAGES } from "@/lib/validation-messages";

import { StatementStatusEnum, LineItemTypeEnum } from "./entity";

// Base64 validation regex (standard base64 alphabet + padding)
const BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;

// Maximum file size in base64 characters (~10MB file = ~13.3MB base64)
const MAX_FILE_DATA_LENGTH = 14_000_000;

// Statement Upload Schema
export const StatementUploadSchema = z.object({
  creditCardId: z
    .number({
      required_error: VALIDATION_MESSAGES.required.creditCard,
      invalid_type_error: VALIDATION_MESSAGES.invalid.creditCard,
    })
    .int()
    .positive(VALIDATION_MESSAGES.invalid.creditCard),
  bankCode: z
    .string({
      required_error: VALIDATION_MESSAGES.file.bankCodeRequired,
    })
    .min(1, VALIDATION_MESSAGES.file.bankCodeRequired)
    .max(50, VALIDATION_MESSAGES.file.bankCodeMax),
  fileName: z
    .string({
      required_error: VALIDATION_MESSAGES.file.fileNameRequired,
    })
    .min(1, VALIDATION_MESSAGES.file.fileNameRequired)
    .max(255, VALIDATION_MESSAGES.file.fileNameMax)
    // Security: Prevent path traversal and invalid characters
    .refine(
      (val) => !val.includes("..") && !val.includes("/") && !val.includes("\\"),
      VALIDATION_MESSAGES.file.fileNameInvalid
    ),
  fileData: z
    .string({
      required_error: VALIDATION_MESSAGES.file.fileDataRequired,
    })
    .min(1, VALIDATION_MESSAGES.file.fileDataRequired)
    // Security: Validate base64 format
    .refine(
      (val) => BASE64_REGEX.test(val),
      VALIDATION_MESSAGES.file.base64Invalid
    )
    // Security: Enforce file size limit (~10MB)
    .refine(
      (val) => val.length <= MAX_FILE_DATA_LENGTH,
      VALIDATION_MESSAGES.file.fileTooLarge
    ),
});

// Statement Update Schema
export const StatementUpdateSchema = z.object({
  statementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data da fatura inválida").optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data de vencimento inválida").optional(),
  previousBalance: validAmount().optional(),
  paymentsReceived: validAmount().optional(),
  purchases: validAmount().optional(),
  fees: validAmount().optional(),
  interest: validAmount().optional(),
  totalAmount: validAmount().optional(),
  status: StatementStatusEnum.optional(),
});

// Line Item Update Schema (for bulk updates before import)
export const LineItemUpdateSchema = z.object({
  id: z.number().int().positive(),
  finalCategoryId: z.number().int().positive().nullable().optional(),
  isDuplicate: z.boolean().optional(),
});

export const LineItemsBulkUpdateSchema = z.object({
  lineItems: z.array(LineItemUpdateSchema).min(1, "Pelo menos um item deve ser atualizado"),
});

// Import Statement Schema
export const StatementImportSchema = z.object({
  updateCurrentBill: z.boolean().default(false),
  excludeLineItemIds: z.array(z.number().int().positive()).default([]),
  lineItemUpdates: z.array(LineItemUpdateSchema).default([]),
});

// Query/Filter Schemas
export const StatementListQuerySchema = z.object({
  creditCardId: z.coerce.number().int().positive().optional(),
  status: StatementStatusEnum.optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Parsed statement data (from PDF parser)
export const ParsedLineItemSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  description: z.string().min(1).max(500),
  amount: z.string().regex(/^-?\d+\.\d{2}$/, "Valor deve estar no formato 0.00 ou -0.00"), // Allow negative for reversals
  type: LineItemTypeEnum,
  category: z.string().max(100).optional(),
});

export const ParsedStatementSchema = z.object({
  bankCode: z.string().min(1).max(50),
  statementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  previousBalance: z.string()
    .regex(/^\d+\.\d{2}$/)
    .refine(val => parseFloat(val) >= 0, "Saldo anterior não pode ser negativo"),
  paymentsReceived: z.string()
    .regex(/^\d+\.\d{2}$/)
    .refine(val => parseFloat(val) >= 0, "Pagamentos recebidos não podem ser negativos"),
  purchases: z.string()
    .regex(/^\d+\.\d{2}$/)
    .refine(val => parseFloat(val) >= 0, "Compras não podem ser negativas"),
  fees: z.string()
    .regex(/^\d+\.\d{2}$/)
    .refine(val => parseFloat(val) >= 0, "Taxas não podem ser negativas"),
  interest: z.string()
    .regex(/^\d+\.\d{2}$/)
    .refine(val => parseFloat(val) >= 0, "Juros não podem ser negativos"),
  totalAmount: z.string()
    .regex(/^\d+\.\d{2}$/)
    .refine(val => parseFloat(val) >= 0, "Valor total não pode ser negativo"),
  lineItems: z.array(ParsedLineItemSchema),
});
