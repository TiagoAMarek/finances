import { createErrorResponse, createSuccessResponse } from "../../lib/auth";
import { db } from "../../lib/db";
import { defaultCategories } from "../../lib/schema";

// GET /api/categories/defaults - Get default categories for seeding
// NOTE: This endpoint is intentionally public (no authentication required)
// Default categories are system-wide templates used for new user onboarding
// They contain no sensitive data and are read-only
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
