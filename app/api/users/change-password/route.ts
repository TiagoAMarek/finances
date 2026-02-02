import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

import { ChangePasswordSchema } from "@/lib/schemas/users";

import {
  createErrorResponse,
  createSuccessResponse,
  getUserFromRequest,
  handleZodError,
  hashPassword,
  verifyPassword,
} from "../../lib/auth";
import { db } from "../../lib/db";
import { users } from "../../lib/schema";

// POST /api/users/change-password - Change current user's password
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) {
      return createErrorResponse("Não autorizado", 401);
    }

    const body = await request.json();
    const validatedData = ChangePasswordSchema.parse(body);

    // Get current user's hashed password
    const [currentUser] = await db
      .select({
        hashedPassword: users.hashedPassword,
      })
      .from(users)
      .where(eq(users.id, user.userId))
      .limit(1);

    if (!currentUser) {
      return createErrorResponse("Usuário não encontrado", 404);
    }

    // Verify current password
    const isValidPassword = await verifyPassword(
      validatedData.currentPassword,
      currentUser.hashedPassword,
    );

    if (!isValidPassword) {
      return createErrorResponse("Senha atual incorreta", 400);
    }

    // Hash new password and update
    const newHashedPassword = await hashPassword(validatedData.newPassword);

    await db
      .update(users)
      .set({
        hashedPassword: newHashedPassword,
      })
      .where(eq(users.id, user.userId));

    return createSuccessResponse({
      message: "Senha alterada com sucesso",
    });
  } catch (error) {
    const zodErrorResponse = handleZodError(error);
    if (zodErrorResponse) return zodErrorResponse;

    console.error("Change password error:", error);
    return createErrorResponse("Erro interno do servidor", 500);
  }
}
