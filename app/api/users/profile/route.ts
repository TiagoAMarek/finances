import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

import { UpdateProfileSchema } from "@/lib/schemas/users";

import {
  createErrorResponse,
  createSuccessResponse,
  getUserFromRequest,
  handleZodError,
} from "../../lib/auth";
import { db } from "../../lib/db";
import { users } from "../../lib/schema";

// GET /api/users/profile - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse("Não autorizado", 401);
    }

    const [profile] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, user.userId))
      .limit(1);

    if (!profile) {
      return createErrorResponse("Usuário não encontrado", 404);
    }

    return createSuccessResponse(profile);
  } catch (error) {
    console.error("Get profile error:", error);
    return createErrorResponse("Erro interno do servidor", 500);
  }
}

// PATCH /api/users/profile - Update current user's profile
export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse("Não autorizado", 401);
    }

    const body = await request.json();
    const validatedData = UpdateProfileSchema.parse(body);

    // Check if email is being changed and if it's already taken by another user
    if (validatedData.email !== user.email) {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, validatedData.email))
        .limit(1);

      if (existingUser.length > 0 && existingUser[0].id !== user.userId) {
        return createErrorResponse(
          "Este email já está sendo usado por outro usuário",
          400,
        );
      }
    }

    // Update user profile
    const [updatedUser] = await db
      .update(users)
      .set({
        name: validatedData.name,
        email: validatedData.email,
      })
      .where(eq(users.id, user.userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
      });

    return createSuccessResponse(updatedUser);
  } catch (error) {
    const zodErrorResponse = handleZodError(error);
    if (zodErrorResponse) return zodErrorResponse;

    console.error("Update profile error:", error);
    return createErrorResponse("Erro interno do servidor", 500);
  }
}
