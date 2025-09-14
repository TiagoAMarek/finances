import { z } from "zod";
import { formatMessage, requiredMessage } from "../base/validation-helpers";

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email(formatMessage("email")),
  password: z.string().min(1, requiredMessage("password")),
});