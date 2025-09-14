import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

import {
  hashPassword,
  createErrorResponse,
  createSuccessResponse,
  handleZodError,
} from "../../lib/auth";
import { db } from "../../lib/db";
import { users } from "../../lib/schema";
import { seedDefaultCategoriesForUser } from "../../lib/seedCategories";
import { RegisterApiSchema } from "../../lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RegisterApiSchema.parse(body);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return createErrorResponse("User with this email already exists", 400);
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(validatedData.password);

    const [newUser] = await db
      .insert(users)
      .values({
        name: validatedData.name,
        email: validatedData.email,
        hashedPassword,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
      });

    // Create default categories for the new user
    await seedDefaultCategoriesForUser(newUser.id);

    return createSuccessResponse(
      {
        message: "Usuário registrado com sucesso",
        user: newUser,
      },
      201,
    );
  } catch (error) {
    const zodErrorResponse = handleZodError(error);
    if (zodErrorResponse) return zodErrorResponse;

    console.error("Registration error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
