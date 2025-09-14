import { z } from "zod";

// Credit card schemas - reflecting API structure
export const CreditCardSchema = z.object({
  id: z.number(),
  name: z.string(),
  limit: z.string(), // Decimal fields come as strings from API
  currentBill: z.string(), // Decimal fields come as strings from API
  ownerId: z.number(),
});