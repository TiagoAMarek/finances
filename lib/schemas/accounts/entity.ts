import { z } from "zod";

// Bank account schemas - reflecting API structure
export const BankAccountSchema = z.object({
  id: z.number(),
  name: z.string(),
  balance: z.string(), // Decimal fields come as strings from API
  currency: z.string(),
  ownerId: z.number(),
});