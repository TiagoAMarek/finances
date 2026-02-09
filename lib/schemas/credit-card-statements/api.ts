import { z } from "zod";

import { validAmount } from "@/lib/schemas/base/validation-helpers";
import { VALIDATION_MESSAGES } from "@/lib/validation-messages";

import { StatementStatusEnum, LineItemTypeEnum } from "./entity";

// Statement Upload Schema
// Note: File data not stored - only metadata (fileName, fileHash) persisted after parsing
export const StatementUploadSchema = z.object({
  creditCardId: z
    .number()
    .int()
    .positive(VALIDATION_MESSAGES.invalid.creditCard),
  bankCode: z
    .string()
    .min(1, VALIDATION_MESSAGES.file.bankCodeRequired)
    .max(50, VALIDATION_MESSAGES.file.bankCodeMax),
  fileName: z
    .string()
    .min(1, VALIDATION_MESSAGES.file.fileNameRequired)
    .max(255, VALIDATION_MESSAGES.file.fileNameMax)
    // Security: Prevent path traversal and invalid characters
    .refine(
      (val) => !val.includes("..") && !val.includes("/") && !val.includes("\\"),
      VALIDATION_MESSAGES.file.fileNameInvalid
    ),
  fileHash: z
    .string()
    .length(64, VALIDATION_MESSAGES.file.fileHashLength)
    .regex(/^[a-f0-9]+$/i, VALIDATION_MESSAGES.file.fileHashLength),
});

// Statement Update Schema
export const StatementUpdateSchema = z.object({
  statementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, VALIDATION_MESSAGES.statement.statementDateInvalid).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, VALIDATION_MESSAGES.statement.dueDateInvalid).optional(),
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
  lineItems: z.array(LineItemUpdateSchema).min(1, VALIDATION_MESSAGES.statement.lineItemsMin),
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
  amount: z.string().regex(/^-?\d+\.\d{2}$/, VALIDATION_MESSAGES.statement.amountFormat), // Allow negative for reversals
  type: LineItemTypeEnum,
  category: z.string().max(100).optional(),
});

export const ParsedStatementSchema = z.object({
  bankCode: z.string().min(1).max(50),
  statementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  previousBalance: z.string()
    .regex(/^\d+\.\d{2}$/)
    .refine(val => parseFloat(val) >= 0, VALIDATION_MESSAGES.statement.previousBalanceNegative),
  paymentsReceived: z.string()
    .regex(/^\d+\.\d{2}$/)
    .refine(val => parseFloat(val) >= 0, VALIDATION_MESSAGES.statement.paymentsReceivedNegative),
  purchases: z.string()
    .regex(/^\d+\.\d{2}$/)
    .refine(val => parseFloat(val) >= 0, VALIDATION_MESSAGES.statement.purchasesNegative),
  fees: z.string()
    .regex(/^\d+\.\d{2}$/)
    .refine(val => parseFloat(val) >= 0, VALIDATION_MESSAGES.statement.feesNegative),
  interest: z.string()
    .regex(/^\d+\.\d{2}$/)
    .refine(val => parseFloat(val) >= 0, VALIDATION_MESSAGES.statement.interestNegative),
  totalAmount: z.string()
    .regex(/^\d+\.\d{2}$/)
    .refine(val => parseFloat(val) >= 0, VALIDATION_MESSAGES.statement.totalAmountNegative),
  lineItems: z.array(ParsedLineItemSchema),
});
