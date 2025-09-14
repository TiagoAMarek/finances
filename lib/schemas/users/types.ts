import { z } from "zod";
import { UserSchema } from "./entity";

// Entity types (API responses)
export type User = z.infer<typeof UserSchema>;