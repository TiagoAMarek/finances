import { z } from "zod";
import { VALIDATION_MESSAGES, requiredMessage } from "../base/validation-helpers";

// API schema with defaults for server processing
export const BankAccountCreateSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.required.accountName),
  balance: z.string().min(1, requiredMessage("balance")).default("0"),
  currency: z.string().min(1, requiredMessage("currency")).default("BRL"),
});

export const BankAccountUpdateSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.required.accountName).optional(),
  balance: z.string().optional(),
  currency: z.string().optional(),
});