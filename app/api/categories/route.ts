import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { categories } from "../lib/schema";
import { CategoryCreateSchema } from "../lib/validation";
import {
  getUserFromRequest,
  createErrorResponse,
  createSuccessResponse,
  handleZodError,
} from "../lib/auth";

// GET /api/categories - List user's categories
export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const userCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.ownerId, user.userId))
      .orderBy(categories.type, categories.name);

    return createSuccessResponse(userCategories);
  } catch (error) {
    console.error("Get categories error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const body = await request.json();
    const validatedData = CategoryCreateSchema.parse(body);

    const [newCategory] = await db
      .insert(categories)
      .values({
        name: validatedData.name,
        type: validatedData.type,
        color: validatedData.color || null,
        icon: validatedData.icon || null,
        isDefault: false,
        ownerId: user.userId,
      })
      .returning();

    return createSuccessResponse(
      {
        message: "Categoria criada com sucesso",
        category: newCategory,
      },
      201,
    );
  } catch (error) {
    const zodErrorResponse = handleZodError(error);
    if (zodErrorResponse) return zodErrorResponse;

    console.error("Create category error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
