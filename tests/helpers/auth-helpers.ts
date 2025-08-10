import { hashPassword, signToken } from '@/app/api/lib/auth';
import { testUsers, testSchema } from './db-helpers';
import { eq } from 'drizzle-orm';
import type Database from 'better-sqlite3';

export interface TestUser {
  id: number;
  email: string;
  hashedPassword: string;
}

export interface TestUserWithToken extends TestUser {
  token: string;
  plainPassword: string;
}

// Create a test user with hashed password
export const createTestUser = async (
  db: any,
  userData: Partial<{ email: string; password: string }> = {}
): Promise<TestUserWithToken> => {
  const email = userData.email || 'test@example.com';
  const plainPassword = userData.password || '123456';
  const hashedPassword = await hashPassword(plainPassword);

  // Insert user into test database
  const [user] = await db.insert(testUsers).values({
    email,
    hashedPassword,
  }).returning();

  // Generate JWT token
  const token = await signToken({ userId: user.id, email: user.email });

  return {
    ...user,
    token,
    plainPassword,
  };
};

// Create multiple test users
export const createTestUsers = async (
  db: any,
  count: number = 2
): Promise<TestUserWithToken[]> => {
  const users: TestUserWithToken[] = [];
  
  for (let i = 0; i < count; i++) {
    const user = await createTestUser(db, {
      email: `user${i + 1}@example.com`,
      password: `password${i + 1}`,
    });
    users.push(user);
  }
  
  return users;
};

// Create authorization header for requests
export const createAuthHeader = (token: string): Record<string, string> => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Create unauthorized request (no token)
export const createUnauthorizedHeaders = (): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
  };
};

// Mock NextRequest with authorization header
export const createMockRequest = (
  url: string,
  options: {
    method?: string;
    body?: any;
    token?: string;
    headers?: Record<string, string>;
  } = {}
) => {
  const { method = 'GET', body, token, headers = {} } = options;
  
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const requestInit: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && method !== 'GET') {
    requestInit.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return new Request(url, requestInit);
};

// Verify that a user exists in database
export const getUserById = async (db: any, userId: number): Promise<TestUser | null> => {
  try {
    const [user] = await db.select().from(testUsers).where(eq(testUsers.id, userId));
    return user || null;
  } catch {
    return null;
  }
};

// Helper to extract user ID from token
export const extractUserIdFromToken = async (token: string): Promise<number | null> => {
  try {
    const { verifyToken } = await import('@/app/api/lib/auth');
    const payload = await verifyToken(token);
    return payload?.userId || null;
  } catch {
    return null;
  }
};