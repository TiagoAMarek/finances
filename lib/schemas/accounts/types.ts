import { z } from "zod";

import { BankAccountCreateSchema, BankAccountUpdateSchema } from "./api";
import { BankAccountSchema } from "./entity";
import { BankAccountFormSchema } from "./forms";

// Entity types (API responses)
export type BankAccount = z.infer<typeof BankAccountSchema>;

// Input types (for forms and API requests)
export type BankAccountFormInput = z.infer<typeof BankAccountFormSchema>;
export type BankAccountCreateInput = z.infer<typeof BankAccountCreateSchema>;
export type BankAccountUpdateInput = z.infer<typeof BankAccountUpdateSchema>;