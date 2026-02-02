import { z } from "zod";
import {
  CreditCardStatementSchema,
  StatementLineItemSchema,
  CreditCardStatementWithLineItemsSchema,
  CreditCardStatementWithCardSchema,
  StatementStatusEnum,
  LineItemTypeEnum,
} from "./entity";
import {
  StatementUploadSchema,
  StatementUpdateSchema,
  LineItemUpdateSchema,
  LineItemsBulkUpdateSchema,
  StatementImportSchema,
  StatementListQuerySchema,
  ParsedLineItemSchema,
  ParsedStatementSchema,
} from "./api";

// Entity types
export type CreditCardStatement = z.infer<typeof CreditCardStatementSchema>;
export type StatementLineItem = z.infer<typeof StatementLineItemSchema>;
export type CreditCardStatementWithLineItems = z.infer<typeof CreditCardStatementWithLineItemsSchema>;
export type CreditCardStatementWithCard = z.infer<typeof CreditCardStatementWithCardSchema>;
export type StatementStatus = z.infer<typeof StatementStatusEnum>;
export type LineItemType = z.infer<typeof LineItemTypeEnum>;

// API Input types
export type StatementUploadInput = z.infer<typeof StatementUploadSchema>;
export type StatementUpdateInput = z.infer<typeof StatementUpdateSchema>;
export type LineItemUpdateInput = z.infer<typeof LineItemUpdateSchema>;
export type LineItemsBulkUpdateInput = z.infer<typeof LineItemsBulkUpdateSchema>;
export type StatementImportInput = z.infer<typeof StatementImportSchema>;
export type StatementListQuery = z.infer<typeof StatementListQuerySchema>;

// Parsed data types (from PDF parser)
export type ParsedLineItem = z.infer<typeof ParsedLineItemSchema>;
export type ParsedStatement = z.infer<typeof ParsedStatementSchema>;

// Duplicate detection result type
export type DuplicateInfo = {
  existingTransactionId: number;
  confidence: number; // 0-1
  reason: string;
};

// Import result type
export type StatementImportResult = {
  statementId: number;
  createdTransactionIds: number[];
  skippedLineItemIds: number[];
  updatedCurrentBill: boolean;
  newCurrentBill?: string;
};
