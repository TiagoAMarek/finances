import { z } from "zod";
import { VALIDATION_MESSAGES, requiredMessage, formatMessage } from "../base/validation-helpers";

export const CategoryCreateSchema = z.object({
  name: z.string().min(1, requiredMessage("name")),
  type: z.enum(["income", "expense", "both"], {
    errorMap: () => ({
      message: VALIDATION_MESSAGES.enums.categoryType,
    }),
  }),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, formatMessage("hexColor"))
    .optional(),
  icon: z.string().min(1, requiredMessage("icon")).optional(),
});

export const CategoryUpdateSchema = z.object({
  name: z.string().min(1, requiredMessage("name")).optional(),
  type: z
    .enum(["income", "expense", "both"], {
      errorMap: () => ({
        message: VALIDATION_MESSAGES.enums.categoryType,
      }),
    })
    .optional(),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, formatMessage("hexColor"))
    .optional(),
  icon: z.string().min(1, requiredMessage("icon")).optional(),
});