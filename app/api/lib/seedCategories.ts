import { db } from "./db";
import { categories } from "./schema";
import { DEFAULT_CATEGORIES } from "./defaultCategories";

export async function seedDefaultCategoriesForUser(
  userId: number,
): Promise<void> {
  try {
    const categoriesToInsert = DEFAULT_CATEGORIES.map((category) => ({
      name: category.name,
      type: category.type,
      color: category.color,
      icon: category.icon,
      isDefault: true,
      ownerId: userId,
      // Let database handle createdAt with default value
    }));

    await db.insert(categories).values(categoriesToInsert);

    console.log(
      `Created ${categoriesToInsert.length} default categories for user ${userId}`,
    );
  } catch (error) {
    console.error("Error seeding default categories:", error);
    throw error;
  }
}
