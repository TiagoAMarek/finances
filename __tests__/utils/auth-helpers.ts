import { server } from "../mocks/server";
import { authErrorHandlers } from "../mocks/handlers/auth";
import { mockTokens, mockUsers, authScenarios, registrationScenarios } from "../mocks/data/auth";
import { localStorageMock } from "./test-utils";

/**
 * Authentication test utilities and helpers
 * 
 * Provides convenient functions for testing authentication flows,
 * managing auth state, and simulating various auth scenarios.
 */

export const authTestHelpers = {
  // ===================
  // Auth State Management
  // ===================

  /**
   * Set up authenticated user state in localStorage
   */
  loginUser: (userEmail: string = "test@example.com") => {
    const user = mockUsers.find(u => u.email === userEmail);
    if (!user) {
      throw new Error(`Mock user not found: ${userEmail}`);
    }
    
    localStorageMock.getItem.mockImplementation((key: string) => 
      key === "access_token" ? user.token : null
    );
    
    return {
      userId: user.id,
      email: user.email,
      token: user.token,
    };
  },

  /**
   * Log out current user (clear auth state)
   */
  logoutUser: () => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.removeItem.mockClear();
  },

  /**
   * Set up admin user authentication
   */
  loginAdmin: () => {
    return authTestHelpers.loginUser("admin@example.com");
  },

  /**
   * Set up expired token scenario
   */
  loginExpiredUser: () => {
    localStorageMock.getItem.mockImplementation((key: string) => 
      key === "access_token" ? mockTokens.expiredToken : null
    );
    
    return {
      userId: 3,
      email: "expired@example.com",
      token: mockTokens.expiredToken,
    };
  },

  // ===================
  // Authentication Scenarios
  // ===================

  /**
   * Get valid login credentials for testing
   */
  getValidCredentials: () => authScenarios.validLogin,

  /**
   * Get invalid login credentials for testing
   */
  getInvalidCredentials: () => authScenarios.invalidCredentials,

  /**
   * Get admin login credentials
   */
  getAdminCredentials: () => authScenarios.adminLogin,

  /**
   * Get valid registration data
   */
  getValidRegistrationData: () => registrationScenarios.validRegistration,

  /**
   * Get registration data for existing email
   */
  getExistingEmailRegistrationData: () => registrationScenarios.existingEmail,

  // ===================
  // API Response Helpers
  // ===================

  /**
   * Expect successful login response structure
   */
  expectSuccessfulLoginResponse: (response: any) => {
    expect(response).toHaveProperty("access_token");
    expect(typeof response.access_token).toBe("string");
    expect(response.access_token.length).toBeGreaterThan(0);
  },

  /**
   * Expect successful registration response structure
   */
  expectSuccessfulRegistrationResponse: (response: any) => {
    expect(response).toHaveProperty("message", "Usuário registrado com sucesso");
    expect(response).toHaveProperty("user");
    expect(response.user).toHaveProperty("id");
    expect(response.user).toHaveProperty("email");
    expect(response.user).not.toHaveProperty("hashedPassword");
    expect(response.user).not.toHaveProperty("plainPassword");
  },

  /**
   * Expect error response structure
   */
  expectErrorResponse: (response: any, expectedMessage?: string) => {
    expect(response).toHaveProperty("detail");
    if (expectedMessage) {
      expect(response.detail).toBe(expectedMessage);
    }
  },

  // ===================
  // Mock Server Control
  // ===================

  /**
   * Simulate network error for auth requests
   */
  simulateNetworkError: () => {
    server.use(authErrorHandlers.networkError);
  },

  /**
   * Simulate server error for auth requests
   */
  simulateServerError: () => {
    server.use(authErrorHandlers.serverError);
  },

  /**
   * Simulate slow network for auth requests
   */
  simulateSlowNetwork: () => {
    server.use(authErrorHandlers.slowNetwork);
  },

  /**
   * Simulate rate limiting for auth requests
   */
  simulateRateLimiting: () => {
    server.use(authErrorHandlers.rateLimited);
  },

  /**
   * Reset to default auth handlers
   */
  resetAuthHandlers: () => {
    server.resetHandlers();
  },

  // ===================
  // Form Testing Helpers
  // ===================

  /**
   * Fill login form with valid credentials
   */
  fillLoginForm: (getByLabelText: any, getByRole?: any) => {
    const credentials = authTestHelpers.getValidCredentials();
    
    const emailInput = getByLabelText(/email/i);
    const passwordInput = getByLabelText(/senha|password/i);
    
    // Clear existing values
    emailInput.value = "";
    passwordInput.value = "";
    
    // Fill with valid credentials
    emailInput.value = credentials.email;
    passwordInput.value = credentials.password;
    
    // Trigger change events
    emailInput.dispatchEvent(new Event("input", { bubbles: true }));
    passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
    
    return {
      emailInput,
      passwordInput,
      submitButton: getByRole ? getByRole("button", { name: /entrar|login/i }) : null,
    };
  },

  /**
   * Fill registration form with valid data
   */
  fillRegistrationForm: (getByLabelText: any, getByRole?: any) => {
    const registrationData = authTestHelpers.getValidRegistrationData();
    
    const emailInput = getByLabelText(/email/i);
    const passwordInput = getByLabelText(/senha|password/i);
    
    // Clear existing values
    emailInput.value = "";
    passwordInput.value = "";
    
    // Fill with valid data
    emailInput.value = registrationData.email;
    passwordInput.value = registrationData.password;
    
    // Trigger change events
    emailInput.dispatchEvent(new Event("input", { bubbles: true }));
    passwordInput.dispatchEvent(new Event("input", { bubbles: true }));
    
    return {
      emailInput,
      passwordInput,
      submitButton: getByRole ? getByRole("button", { name: /registrar|register/i }) : null,
    };
  },

  // ===================
  // Token Validation
  // ===================

  /**
   * Validate JWT token structure (simplified for testing)
   */
  validateTokenStructure: (token: string) => {
    expect(token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/); // JWT format: header.payload.signature
    expect(token.length).toBeGreaterThan(50); // Reasonable token length
  },

  /**
   * Check if token belongs to specific user
   */
  expectTokenForUser: (token: string, expectedUserId: number) => {
    const user = mockUsers.find(u => u.id === expectedUserId);
    expect(user).toBeTruthy();
    expect(token).toBe(user?.token);
  },

  // ===================
  // Integration Test Helpers
  // ===================

  /**
   * Simulate complete login flow
   */
  performLoginFlow: async (fetchFunction: Function, credentials?: any) => {
    const creds = credentials || authTestHelpers.getValidCredentials();
    
    const response = await fetchFunction("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(creds),
    });
    
    return {
      response,
      data: response.ok ? await response.json() : await response.json().catch(() => ({})),
      status: response.status,
    };
  },

  /**
   * Simulate complete registration flow
   */
  performRegistrationFlow: async (fetchFunction: Function, registrationData?: any) => {
    const data = registrationData || authTestHelpers.getValidRegistrationData();
    
    const response = await fetchFunction("/api/auth/register", {
      method: "POST", 
      body: JSON.stringify(data),
    });
    
    return {
      response,
      data: response.ok ? await response.json() : await response.json().catch(() => ({})),
      status: response.status,
    };
  },

  /**
   * Test authenticated request
   */
  performAuthenticatedRequest: async (fetchFunction: Function, endpoint: string, options?: any) => {
    // Set up authentication
    const authUser = authTestHelpers.loginUser();
    
    const response = await fetchFunction(endpoint, {
      ...options,
      headers: {
        'Authorization': `Bearer ${authUser.token}`,
        ...options?.headers,
      },
    });
    
    return {
      response,
      data: response.ok ? await response.json() : await response.json().catch(() => ({})),
      status: response.status,
    };
  },
};

// Export commonly used auth data for direct access
export { 
  mockTokens, 
  mockUsers, 
  authScenarios, 
  registrationScenarios 
} from "../mocks/data/auth";