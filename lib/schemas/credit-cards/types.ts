import { z } from "zod";

import { CreditCardCreateSchema, CreditCardUpdateSchema } from "./api";
import { CreditCardSchema } from "./entity";

// Entity types (API responses)
export type CreditCard = z.infer<typeof CreditCardSchema>;

// Input types (for forms and API requests)
export type CreditCardCreateInput = z.infer<typeof CreditCardCreateSchema>;
export type CreditCardUpdateInput = z.infer<typeof CreditCardUpdateSchema>;