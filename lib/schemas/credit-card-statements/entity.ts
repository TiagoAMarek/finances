import { z } from "zod";

import {
  CreditCardStatementSelectSchema,
  StatementLineItemSelectSchema,
} from "../drizzle-schemas";

// Re-export drizzle-generated schemas for credit card statements
export {
  CreditCardStatementSelectSchema as CreditCardStatementSchema,
  StatementLineItemSelectSchema as StatementLineItemSchema,
} from "../drizzle-schemas";

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

// Statement with line items (for API responses)
export const CreditCardStatementWithLineItemsSchema = CreditCardStatementSelectSchema.extend({
  lineItems: z.array(StatementLineItemSelectSchema).optional(),
});

// Statement with credit card info
export const CreditCardStatementWithCardSchema = CreditCardStatementSelectSchema.extend({
  creditCard: z.object({
    id: z.number().int().positive(),
    name: z.string(),
    limit: z.string().regex(/^\d+\.\d{2}$/),
    currentBill: z.string().regex(/^\d+\.\d{2}$/),
  }).optional(),
});
