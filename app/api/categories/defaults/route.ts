import { db } from "../../lib/db";
import { defaultCategories } from "../../lib/schema";
import { createErrorResponse, createSuccessResponse } from "../../lib/auth";

// GET /api/categories/defaults - Get default categories for seeding
export async function GET() {
  try {
    const defaults = await db
      .select()
      .from(defaultCategories)
      .orderBy(defaultCategories.type, defaultCategories.name);

    return createSuccessResponse(defaults);
  } catch (error) {
    console.error("Get default categories error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
