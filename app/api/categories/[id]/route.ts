import { NextRequest } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "../../lib/db";
import { categories, transactions } from "../../lib/schema";
import { CategoryUpdateSchema } from "../../lib/validation";
import {
  getUserFromRequest,
  createErrorResponse,
  createSuccessResponse,
  handleZodError,
} from "../../lib/auth";

// GET /api/categories/[id] - Get specific category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const categoryId = parseInt(params.id);
    if (isNaN(categoryId)) {
      return createErrorResponse("ID de categoria inválido", 400);
    }

    const [category] = await db
      .select()
      .from(categories)
      .where(
        and(eq(categories.id, categoryId), eq(categories.ownerId, user.userId)),
      );

    if (!category) {
      return createErrorResponse("Categoria não encontrada", 404);
    }

    return createSuccessResponse(category);
  } catch (error) {
    console.error("Get category error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// PUT /api/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const categoryId = parseInt(params.id);
    if (isNaN(categoryId)) {
      return createErrorResponse("ID de categoria inválido", 400);
    }

    const body = await request.json();
    const validatedData = CategoryUpdateSchema.parse(body);

    // Check if category belongs to user
    const [existingCategory] = await db
      .select()
      .from(categories)
      .where(
        and(eq(categories.id, categoryId), eq(categories.ownerId, user.userId)),
      );

    if (!existingCategory) {
      return createErrorResponse("Categoria não encontrada", 404);
    }

    // Check if it's a default category (cannot be edited)
    if (existingCategory.isDefault) {
      return createErrorResponse(
        "Categorias padrão não podem ser editadas",
        400,
      );
    }

    const [updatedCategory] = await db
      .update(categories)
      .set({
        name: validatedData.name ?? existingCategory.name,
        type: validatedData.type ?? existingCategory.type,
        color: validatedData.color ?? existingCategory.color,
        icon: validatedData.icon ?? existingCategory.icon,
      })
      .where(eq(categories.id, categoryId))
      .returning();

    return createSuccessResponse({
      message: "Categoria atualizada com sucesso",
      category: updatedCategory,
    });
  } catch (error) {
    const zodErrorResponse = handleZodError(error);
    if (zodErrorResponse) return zodErrorResponse;

    console.error("Update category error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const user = await getUserFromRequest(request);

  if (!user) {
    return createErrorResponse("Unauthorized", 401);
  }

  try {
    const categoryId = parseInt(params.id);
    if (isNaN(categoryId)) {
      return createErrorResponse("ID de categoria inválido", 400);
    }

    // Check if category belongs to user
    const [existingCategory] = await db
      .select()
      .from(categories)
      .where(
        and(eq(categories.id, categoryId), eq(categories.ownerId, user.userId)),
      );

    if (!existingCategory) {
      return createErrorResponse("Categoria não encontrada", 404);
    }

    // Check if it's a default category (cannot be deleted)
    if (existingCategory.isDefault) {
      return createErrorResponse(
        "Categorias padrão não podem ser excluídas",
        400,
      );
    }

    // Check if category is used in any transactions
    const [transactionCount] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.categoryId, categoryId))
      .limit(1);

    if (transactionCount) {
      return createErrorResponse(
        "Não é possível excluir categoria que possui transações associadas",
        400,
      );
    }

    await db.delete(categories).where(eq(categories.id, categoryId));

    return createSuccessResponse({
      message: "Categoria excluída com sucesso",
    });
  } catch (error) {
    console.error("Delete category error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
