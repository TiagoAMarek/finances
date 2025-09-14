import { z } from "zod";
import { VALIDATION_MESSAGES, requiredMessage } from "../base/validation-helpers";

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