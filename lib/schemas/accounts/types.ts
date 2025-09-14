import { z } from "zod";
import { BankAccountSchema } from "./entity";
import { BankAccountFormSchema } from "./forms";
import { BankAccountCreateSchema, BankAccountUpdateSchema } from "./api";

// Entity types (API responses)
export type BankAccount = z.infer<typeof BankAccountSchema>;

// Input types (for forms and API requests)
export type BankAccountFormInput = z.infer<typeof BankAccountFormSchema>;
export type BankAccountCreateInput = z.infer<typeof BankAccountCreateSchema>;
export type BankAccountUpdateInput = z.infer<typeof BankAccountUpdateSchema>;