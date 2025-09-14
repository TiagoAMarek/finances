import { z } from "zod";

import { VALIDATION_MESSAGES, formatMessage } from "../base/validation-helpers";

// API register schema (what gets sent to the API)
export const RegisterApiSchema = z.object({
  name: z.string().min(2, VALIDATION_MESSAGES.length.nameMin),
  email: z.string().email(formatMessage("email")),
  password: z
    .string()
    .min(8, VALIDATION_MESSAGES.length.passwordMin)
    .regex(/[A-Z]/, VALIDATION_MESSAGES.password.uppercase)
    .regex(/[a-z]/, VALIDATION_MESSAGES.password.lowercase)
    .regex(/[0-9]/, VALIDATION_MESSAGES.password.number)
    .regex(
      /[^A-Za-z0-9]/,
      VALIDATION_MESSAGES.password.special,
    ),
});

// Form register schema (includes confirm password for UI validation)
export const RegisterSchema = RegisterApiSchema.extend({
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: VALIDATION_MESSAGES.password.match,
  path: ["confirmPassword"],
});