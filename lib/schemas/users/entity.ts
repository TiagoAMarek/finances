import { z } from "zod";

// User schema - reflecting API structure
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  hashedPassword: z.string(),
});