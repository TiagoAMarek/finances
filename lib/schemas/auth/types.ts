import { z } from "zod";

import { LoginSchema } from "./login";
import { RegisterSchema, RegisterApiSchema } from "./register";

// Input types (for forms and API requests)
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type RegisterApiInput = z.infer<typeof RegisterApiSchema>;