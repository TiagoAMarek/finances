import { z } from "zod";
import { validAmount } from "@/lib/schemas/base/validation-helpers";
import { VALIDATION_MESSAGES } from "@/lib/validation-messages";
import { StatementStatusEnum, LineItemTypeEnum } from "./entity";

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
      required_error: "Código do banco é obrigatório",
    })
    .min(1, "Código do banco é obrigatório")
    .max(50, "Código do banco deve ter no máximo 50 caracteres"),
  fileName: z
    .string({
      required_error: "Nome do arquivo é obrigatório",
    })
    .min(1, "Nome do arquivo é obrigatório")
    .max(255, "Nome do arquivo deve ter no máximo 255 caracteres"),
  fileData: z
    .string({
      required_error: "Dados do arquivo são obrigatórios",
    })
    .min(1, "Dados do arquivo são obrigatórios"), // Base64 encoded PDF
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
  amount: z.string().regex(/^\d+\.\d{2}$/),
  type: LineItemTypeEnum,
  category: z.string().max(100).optional(),
});

export const ParsedStatementSchema = z.object({
  bankCode: z.string().min(1).max(50),
  statementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  previousBalance: z.string().regex(/^\d+\.\d{2}$/),
  paymentsReceived: z.string().regex(/^\d+\.\d{2}$/),
  purchases: z.string().regex(/^\d+\.\d{2}$/),
  fees: z.string().regex(/^\d+\.\d{2}$/),
  interest: z.string().regex(/^\d+\.\d{2}$/),
  totalAmount: z.string().regex(/^\d+\.\d{2}$/),
  lineItems: z.array(ParsedLineItemSchema),
});
