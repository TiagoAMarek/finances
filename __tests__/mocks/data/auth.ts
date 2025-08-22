/**
 * Mock authentication data for MSW handlers
 *
 * Provides realistic user credentials, tokens, and authentication scenarios
 * for comprehensive testing of authentication flows.
 */

// Mock JWT tokens (base64 encoded realistic structure)
export const mockTokens = {
  validToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ.test-signature",
  adminToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDA4NjQwMH0.admin-signature",
  expiredToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoiZXhwaXJlZEBleGFtcGxlLmNvbSIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDg2NDAwfQ.expired-signature",
};

// Mock user database
export const mockUsers = [
  {
    id: 1,
    email: "test@example.com",
    hashedPassword: "$2b$10$mock.hashed.password.for.testing.purposes.123456",
    plainPassword: "123456", // For testing purposes only
    token: mockTokens.validToken,
  },
  {
    id: 2,
    email: "admin@example.com",
    hashedPassword:
      "$2b$10$mock.admin.hashed.password.for.testing.purposes.admin123",
    plainPassword: "admin123",
    token: mockTokens.adminToken,
    role: "admin",
  },
  {
    id: 3,
    email: "expired@example.com",
    hashedPassword:
      "$2b$10$mock.expired.hashed.password.for.testing.purposes.expired",
    plainPassword: "expired123",
    token: mockTokens.expiredToken,
  },
  {
    id: 4,
    email: "newuser@example.com",
    hashedPassword:
      "$2b$10$mock.new.hashed.password.for.testing.purposes.newuser",
    plainPassword: "newuser123",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImVtYWlsIjoibmV3dXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ.newuser-signature",
  },
];

// Authentication scenarios for testing
export const authScenarios = {
  validLogin: {
    email: "test@example.com",
    password: "123456",
    expectedToken: mockTokens.validToken,
    expectedUserId: 1,
  },
  adminLogin: {
    email: "admin@example.com",
    password: "admin123",
    expectedToken: mockTokens.adminToken,
    expectedUserId: 2,
  },
  invalidCredentials: {
    email: "test@example.com",
    password: "wrongpassword",
    expectedError: "Invalid email or password",
  },
  nonExistentUser: {
    email: "nonexistent@example.com",
    password: "123456",
    expectedError: "Invalid email or password",
  },
  invalidEmail: {
    email: "invalid-email",
    password: "123456",
    expectedError: "Formato de email inválido",
  },
  emptyPassword: {
    email: "test@example.com",
    password: "",
    expectedError: "Senha é obrigatória",
  },
};

// Registration scenarios
export const registrationScenarios = {
  validRegistration: {
    email: "newuser@example.com",
    password: "newuser123",
    expectedUserId: 4,
  },
  existingEmail: {
    email: "test@example.com", // Already exists in mockUsers
    password: "123456",
    expectedError: "Email já está em uso",
  },
  invalidEmail: {
    email: "invalid-email",
    password: "123456",
    expectedError: "Formato de email inválido",
  },
  shortPassword: {
    email: "shortpass@example.com",
    password: "123",
    expectedError: "Senha deve ter pelo menos 6 caracteres",
  },
};

// Helper functions for token operations
export const authHelpers = {
  /**
   * Find user by email
   */
  findUserByEmail: (email: string) => {
    return mockUsers.find((user) => user.email === email);
  },

  /**
   * Validate user credentials
   */
  validateCredentials: (email: string, password: string) => {
    const user = authHelpers.findUserByEmail(email);
    return user && user.plainPassword === password ? user : null;
  },

  /**
   * Check if email already exists
   */
  emailExists: (email: string) => {
    return mockUsers.some((user) => user.email === email);
  },

  /**
   * Generate mock JWT token for user
   */
  generateTokenForUser: (userId: number) => {
    const user = mockUsers.find((u) => u.id === userId);
    return user?.token || mockTokens.validToken;
  },

  /**
   * Extract user ID from token (simplified for testing)
   */
  getUserIdFromToken: (token: string) => {
    if (token === mockTokens.validToken) return 1;
    if (token === mockTokens.adminToken) return 2;
    if (token === mockTokens.expiredToken) return 3;
    return 1; // Default fallback
  },

  /**
   * Check if token is expired (for testing purposes)
   */
  isTokenExpired: (token: string) => {
    return token === mockTokens.expiredToken;
  },
};

