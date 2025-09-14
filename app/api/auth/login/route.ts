import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

import {
  verifyPassword,
  signToken,
  createErrorResponse,
  createSuccessResponse,
  handleZodError,
} from "../../lib/auth";
import { db } from "../../lib/db";
import { users } from "../../lib/schema";
import { LoginSchema } from "../../lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = LoginSchema.parse(body);

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, validatedData.email))
      .limit(1);

    if (!user) {
      return createErrorResponse("Invalid email or password", 401);
    }

    // Verify password
    const isValidPassword = await verifyPassword(
      validatedData.password,
      user.hashedPassword,
    );

    if (!isValidPassword) {
      return createErrorResponse("Invalid email or password", 401);
    }

    // Generate JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
    });

    return createSuccessResponse({
      access_token: token,
    });
  } catch (error) {
    const zodErrorResponse = handleZodError(error);
    if (zodErrorResponse) return zodErrorResponse;

    console.error("Login error:", error);
    return createErrorResponse("Internal server error", 500);
  }
}
