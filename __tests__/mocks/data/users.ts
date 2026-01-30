/**
 * Mock user profile data for MSW handlers
 *
 * Provides realistic user profile information for testing
 * profile management and password change features.
 */

import { mockUsers } from "./auth";

// User profiles with extended information
export const mockUserProfiles = [
  {
    id: 1,
    name: "Test User",
    email: "test@example.com",
  },
  {
    id: 2,
    name: "Admin User",
    email: "admin@example.com",
  },
  {
    id: 3,
    name: "Expired Token User",
    email: "expired@example.com",
  },
  {
    id: 4,
    name: "New User",
    email: "newuser@example.com",
  },
];

// Helper functions for user profile operations
export const userHelpers = {
  /**
   * Find user profile by user ID
   */
  findProfileByUserId: (userId: number) => {
    return mockUserProfiles.find((profile) => profile.id === userId);
  },

  /**
   * Find user by email
   */
  findUserByEmail: (email: string) => {
    return mockUsers.find((user) => user.email === email);
  },

  /**
   * Check if email is already taken by another user
   */
  isEmailTaken: (email: string, currentUserId: number) => {
    return mockUsers.some((user) => user.email === email && user.id !== currentUserId);
  },

  /**
   * Verify password for user
   */
  verifyPassword: (userId: number, password: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    return user && user.plainPassword === password;
  },

  /**
   * Extract user ID from authorization header
   */
  getUserIdFromAuth: (authHeader: string | null): number | null => {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    const user = mockUsers.find((u) => u.token === token);
    return user?.id || null;
  },
};
