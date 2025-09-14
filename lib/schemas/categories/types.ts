import { z } from "zod";
import { CategorySchema, DefaultCategorySchema } from "./entity";
import { CategoryCreateSchema, CategoryUpdateSchema } from "./api";

// Entity types (API responses)
export type Category = z.infer<typeof CategorySchema>;
export type DefaultCategory = z.infer<typeof DefaultCategorySchema>;

// Input types (for forms and API requests)
export type CategoryCreateInput = z.infer<typeof CategoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof CategoryUpdateSchema>;