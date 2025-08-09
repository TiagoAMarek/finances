import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '../../lib/db';
import { users } from '../../lib/schema';
import { RegisterSchema } from '../../lib/validation';
import { hashPassword, createErrorResponse, createSuccessResponse } from '../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RegisterSchema.parse(body);

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, validatedData.email)).limit(1);
    
    if (existingUser.length > 0) {
      return createErrorResponse('User with this email already exists', 400);
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(validatedData.password);
    
    const [newUser] = await db.insert(users).values({
      email: validatedData.email,
      hashedPassword,
    }).returning({
      id: users.id,
      email: users.email,
    });

    return createSuccessResponse({
      message: 'User registered successfully',
      user: newUser,
    }, 201);

  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return createErrorResponse('Invalid input data', 400);
    }
    
    console.error('Registration error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}