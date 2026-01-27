import { z } from "zod";

import { VALIDATION_MESSAGES, validAmount } from "../base/validation-helpers";

export const CreditCardCreateSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.required.cardName),
  limit: validAmount("limit"),
  currentBill: validAmount("currentBill"),
});

export const CreditCardUpdateSchema = z.object({
  name: z.string().min(1, VALIDATION_MESSAGES.required.cardName).optional(),
  limit: validAmount("limit").optional(),
  currentBill: validAmount("currentBill").optional(),
});