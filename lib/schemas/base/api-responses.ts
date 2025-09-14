import { z } from "zod";
import { UserSchema } from "../users/entity";

// Response schemas
export const LoginResponseSchema = z.object({
  access_token: z.string(),
});

export const RegisterResponseSchema = z.object({
  message: z.string(),
  user: UserSchema.omit({ hashedPassword: true }),
});

export const ApiErrorResponseSchema = z.object({
  detail: z.string(),
});

// API Response wrappers
export interface ApiSuccessResponse<T> {
  [key: string]: T | string;
}

// Response types
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;