import { z } from "zod";
import { CreditCardSchema } from "./entity";
import { CreditCardCreateSchema, CreditCardUpdateSchema } from "./api";

// Entity types (API responses)
export type CreditCard = z.infer<typeof CreditCardSchema>;

// Input types (for forms and API requests)
export type CreditCardCreateInput = z.infer<typeof CreditCardCreateSchema>;
export type CreditCardUpdateInput = z.infer<typeof CreditCardUpdateSchema>;