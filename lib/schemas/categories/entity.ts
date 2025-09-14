import { z } from "zod";

// Category schemas
export const CategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(["income", "expense", "both"]),
  color: z.string().nullable(),
  icon: z.string().nullable(),
  isDefault: z.boolean(),
  ownerId: z.number(),
  createdAt: z.string(), // ISO format string
});

// Default category schema (for seeding)
export const DefaultCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(["income", "expense", "both"]),
  color: z.string().nullable(),
  icon: z.string().nullable(),
});