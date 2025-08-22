import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { renderWithProviders, testHelpers } from "../utils/test-utils";
import { authTestHelpers } from "../utils/auth-helpers";
import { useLogin } from "@/features/auth/hooks/data/useLogin";
import { fetchWithAuth } from "@/utils/api";

/**
 * Comprehensive examples demonstrating MSW authentication mocking
 *
 * This test file showcases various authentication testing scenarios
 * using the MSW login mocking system we've implemented.
 */

// Mock component that uses the login hook
const LoginTestComponent = () => {
  const [credentials, setCredentials] = React.useState({
    email: "",
    password: "",
  });
  const [loginResult, setLoginResult] = React.useState<any>(null);
  const loginMutation = useLogin();

  const handleLogin = async () => {
    try {
      const result = await loginMutation.mutateAsync(credentials);
      setLoginResult({ success: true, data: result });
    } catch (error: any) {
      setLoginResult({ success: false, error: error.message });
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          data-testid="email-input"
        />
      </div>

      <div>
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          data-testid="password-input"
        />
      </div>

      <button
        onClick={handleLogin}
        disabled={loginMutation.isPending}
        data-testid="login-button"
      >
        {loginMutation.isPending ? "Entrando..." : "Entrar"}
      </button>

      {loginResult && (
        <div data-testid="login-result">
          {loginResult.success ? (
            <div data-testid="login-success">
              Login realizado! Token: {loginResult.data?.access_token}
            </div>
          ) : (
            <div data-testid="login-error">Erro: {loginResult.error}</div>
          )}
        </div>
      )}
    </div>
  );
};

describe("MSW Authentication Mocking Examples", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    // Reset authentication state before each test
    testHelpers.resetLocalStorage();
    authTestHelpers.resetAuthHandlers();

    // Create fresh query client for each test
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: 0 },
        mutations: { retry: false },
      },
    });
  });

  describe("🔐 Basic Login Flow Testing", () => {
    it("should successfully login with valid credentials", async () => {
      // Arrange: Get valid credentials from mock data
      const validCredentials = authTestHelpers.getValidCredentials();

      render(<LoginTestComponent />, {
        wrapper: ({ children }) =>
          renderWithProviders(children, { queryClient }),
      });

      // Act: Fill form and submit
      fireEvent.change(screen.getByTestId("email-input"), {
        target: { value: validCredentials.email },
      });
      fireEvent.change(screen.getByTestId("password-input"), {
        target: { value: validCredentials.password },
      });
      fireEvent.click(screen.getByTestId("login-button"));

      // Assert: Check successful login
      await waitFor(() => {
        expect(screen.getByTestId("login-success")).toBeInTheDocument();
      });

      const successMessage = screen.getByTestId("login-success");
      expect(successMessage).toHaveTextContent("Login realizado!");
      expect(successMessage).toHaveTextContent("Token:");
    });

    it("should handle invalid credentials gracefully", async () => {
      // Arrange: Get invalid credentials
      const invalidCredentials = authTestHelpers.getInvalidCredentials();

      render(<LoginTestComponent />, {
        wrapper: ({ children }) =>
          renderWithProviders(children, { queryClient }),
      });

      // Act: Fill form with invalid credentials
      fireEvent.change(screen.getByTestId("email-input"), {
        target: { value: invalidCredentials.email },
      });
      fireEvent.change(screen.getByTestId("password-input"), {
        target: { value: invalidCredentials.password },
      });
      fireEvent.click(screen.getByTestId("login-button"));

      // Assert: Check error handling
      await waitFor(() => {
        expect(screen.getByTestId("login-error")).toBeInTheDocument();
      });

      expect(screen.getByTestId("login-error")).toHaveTextContent(
        "Erro: Invalid email or password",
      );
    });
  });

  describe("🛠️ Direct API Testing", () => {
    it("should mock login API endpoint correctly", async () => {
      // Arrange: Use auth helper to perform login flow
      const result = await authTestHelpers.performLoginFlow(
        fetchWithAuth,
        authTestHelpers.getValidCredentials(),
      );

      // Assert: Check response structure
      expect(result.status).toBe(200);
      authTestHelpers.expectSuccessfulLoginResponse(result.data);
      authTestHelpers.validateTokenStructure(result.data.access_token);
    });

    it("should handle registration API endpoint", async () => {
      // Arrange & Act: Perform registration
      const result = await authTestHelpers.performRegistrationFlow(
        fetchWithAuth,
        authTestHelpers.getValidRegistrationData(),
      );

      // Assert: Check registration response
      expect(result.status).toBe(201);
      authTestHelpers.expectSuccessfulRegistrationResponse(result.data);
    });

    it("should reject registration with existing email", async () => {
      // Arrange & Act: Try to register with existing email
      const result = await authTestHelpers.performRegistrationFlow(
        fetchWithAuth,
        authTestHelpers.getExistingEmailRegistrationData(),
      );

      // Assert: Check error response
      expect(result.status).toBe(409);
      authTestHelpers.expectErrorResponse(result.data, "Email já está em uso");
    });
  });

  describe("🔒 Protected Route Testing", () => {
    it("should allow access to protected endpoints with valid token", async () => {
      // Arrange & Act: Make authenticated request
      const result = await authTestHelpers.performAuthenticatedRequest(
        fetchWithAuth,
        "/api/auth/me",
      );

      // Assert: Check successful authenticated request
      expect(result.status).toBe(200);
      expect(result.data).toHaveProperty("user");
      expect(result.data.user).toHaveProperty("id");
      expect(result.data.user).toHaveProperty("email");
    });

    it("should reject requests with expired tokens", async () => {
      // Arrange: Set up expired token
      authTestHelpers.loginExpiredUser();

      // Act: Try to access protected endpoint
      const response = await fetchWithAuth("/api/auth/me");
      const result = await response.json().catch(() => ({}));

      // Assert: Check token expiration handling
      expect(response.status).toBe(401);
      authTestHelpers.expectErrorResponse(result, "Token expired");
    });

    it("should reject requests without authorization header", async () => {
      // Act: Make request without auth
      const response = await fetch("/api/auth/me");
      const result = await response.json().catch(() => ({}));

      // Assert: Check unauthorized access
      expect(response.status).toBe(401);
      authTestHelpers.expectErrorResponse(
        result,
        "Authorization header required",
      );
    });
  });

  describe("🌐 Network Error Scenarios", () => {
    it("should handle network errors gracefully", async () => {
      // Arrange: Simulate network error
      authTestHelpers.simulateNetworkError();

      render(<LoginTestComponent />, {
        wrapper: ({ children }) =>
          renderWithProviders(children, { queryClient }),
      });

      // Act: Attempt login
      const { emailInput, passwordInput, submitButton } =
        authTestHelpers.fillLoginForm(screen.getByLabelText);

      fireEvent.click(screen.getByTestId("login-button"));

      // Assert: Check error handling
      await waitFor(() => {
        expect(screen.getByTestId("login-error")).toBeInTheDocument();
      });
    });

    it("should handle server errors appropriately", async () => {
      // Arrange: Simulate server error
      authTestHelpers.simulateServerError();

      // Act: Attempt login
      const result = await authTestHelpers.performLoginFlow(
        fetchWithAuth,
        authTestHelpers.getValidCredentials(),
      );

      // Assert: Check server error handling
      expect(result.status).toBe(500);
      authTestHelpers.expectErrorResponse(
        result.data,
        "Database connection failed",
      );
    });

    it("should handle rate limiting", async () => {
      // Arrange: Simulate rate limiting
      authTestHelpers.simulateRateLimiting();

      // Act: Attempt login
      const result = await authTestHelpers.performLoginFlow(
        fetchWithAuth,
        authTestHelpers.getValidCredentials(),
      );

      // Assert: Check rate limiting response
      expect(result.status).toBe(429);
      expect(result.data.detail).toContain("Too many login attempts");
    });
  });

  describe("👤 User State Management", () => {
    it("should maintain authentication state correctly", () => {
      // Act: Login user
      const authUser = authTestHelpers.loginUser();

      // Assert: Check authentication state
      expect(authUser.userId).toBe(1);
      expect(authUser.email).toBe("test@example.com");
      authTestHelpers.validateTokenStructure(authUser.token);

      // Act: Logout user
      authTestHelpers.logoutUser();

      // Assert: Check logout state
      expect(localStorage.getItem("access_token")).toBeNull();
    });

    it("should handle admin user authentication", () => {
      // Act: Login admin
      const adminUser = authTestHelpers.loginAdmin();

      // Assert: Check admin authentication
      expect(adminUser.userId).toBe(2);
      expect(adminUser.email).toBe("admin@example.com");
      expect(adminUser.token).toBe(authTestHelpers.mockTokens.adminToken);
    });
  });

  describe("📝 Form Validation Testing", () => {
    it("should validate email format", async () => {
      render(<LoginTestComponent />, {
        wrapper: ({ children }) =>
          renderWithProviders(children, { queryClient }),
      });

      // Act: Submit with invalid email
      fireEvent.change(screen.getByTestId("email-input"), {
        target: { value: "invalid-email" },
      });
      fireEvent.change(screen.getByTestId("password-input"), {
        target: { value: "123456" },
      });
      fireEvent.click(screen.getByTestId("login-button"));

      // Assert: Check validation error
      await waitFor(() => {
        expect(screen.getByTestId("login-error")).toBeInTheDocument();
      });

      expect(screen.getByTestId("login-error")).toHaveTextContent(
        "Formato de email inválido",
      );
    });

    it("should require password field", async () => {
      render(<LoginTestComponent />, {
        wrapper: ({ children }) =>
          renderWithProviders(children, { queryClient }),
      });

      // Act: Submit with empty password
      fireEvent.change(screen.getByTestId("email-input"), {
        target: { value: "test@example.com" },
      });
      fireEvent.change(screen.getByTestId("password-input"), {
        target: { value: "" },
      });
      fireEvent.click(screen.getByTestId("login-button"));

      // Assert: Check required field validation
      await waitFor(() => {
        expect(screen.getByTestId("login-error")).toBeInTheDocument();
      });

      expect(screen.getByTestId("login-error")).toHaveTextContent(
        "Senha é obrigatória",
      );
    });
  });
});

/**
 * Additional integration examples for real-world scenarios
 */
describe("Real-World Authentication Scenarios", () => {
  beforeEach(() => {
    testHelpers.resetLocalStorage();
    authTestHelpers.resetAuthHandlers();
  });

  it("should simulate complete user journey: registration → login → protected access", async () => {
    // Step 1: Register new user
    const registrationResult = await authTestHelpers.performRegistrationFlow(
      fetchWithAuth,
      { email: "journey@example.com", password: "journey123" },
    );

    expect(registrationResult.status).toBe(201);

    // Step 2: Login with registered credentials
    const loginResult = await authTestHelpers.performLoginFlow(fetchWithAuth, {
      email: "journey@example.com",
      password: "journey123",
    });

    // Note: In mock, this will use existing user data, but demonstrates the flow
    expect(loginResult.status).toBe(200);

    // Step 3: Access protected resource
    const protectedResult = await authTestHelpers.performAuthenticatedRequest(
      fetchWithAuth,
      "/api/auth/me",
    );

    expect(protectedResult.status).toBe(200);
  });

  it("should demonstrate session management and logout", async () => {
    // Login user
    const authUser = authTestHelpers.loginUser();

    // Verify authenticated access
    const protectedResult = await authTestHelpers.performAuthenticatedRequest(
      fetchWithAuth,
      "/api/auth/me",
    );
    expect(protectedResult.status).toBe(200);

    // Perform logout
    const logoutResult = await authTestHelpers.performAuthenticatedRequest(
      fetchWithAuth,
      "/api/auth/logout",
      { method: "POST" },
    );
    expect(logoutResult.status).toBe(200);

    // Logout on client side
    authTestHelpers.logoutUser();

    // Verify access is now denied
    const response = await fetch("/api/auth/me");
    expect(response.status).toBe(401);
  });
});

