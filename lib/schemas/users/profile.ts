import { z } from "zod";

import { formatMessage, VALIDATION_MESSAGES } from "../base/validation-helpers";

// User profile update schema (for updating name and email)
export const UpdateProfileSchema = z.object({
  name: z.string().min(2, VALIDATION_MESSAGES.length.nameMin),
  email: z.string().email(formatMessage("email")),
});

// Change password schema
export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
      .string()
      .min(8, VALIDATION_MESSAGES.length.passwordMin)
      .regex(/[A-Z]/, VALIDATION_MESSAGES.password.uppercase)
      .regex(/[a-z]/, VALIDATION_MESSAGES.password.lowercase)
      .regex(/[0-9]/, VALIDATION_MESSAGES.password.number)
      .regex(/[^A-Za-z0-9]/, VALIDATION_MESSAGES.password.special),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: VALIDATION_MESSAGES.password.match,
    path: ["confirmPassword"],
  });
