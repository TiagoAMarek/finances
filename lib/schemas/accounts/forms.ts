import { z } from "zod";

import { requiredMessage } from "../base/validation-helpers";

// Form schema for react-hook-form (without defaults to keep types clean)
export const BankAccountFormSchema = z.object({
  name: z.string().min(1, requiredMessage("name")),
  balance: z.string().min(1, requiredMessage("balance")),
  currency: z.string().min(1, requiredMessage("currency")),
});