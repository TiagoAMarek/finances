import { z } from "zod";

import { CategoryCreateSchema, CategoryUpdateSchema } from "./api";
import { CategorySchema, DefaultCategorySchema } from "./entity";

// Entity types (API responses)
export type Category = z.infer<typeof CategorySchema>;
export type DefaultCategory = z.infer<typeof DefaultCategorySchema>;

// Input types (for forms and API requests)
export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>;