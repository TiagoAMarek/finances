import { http, HttpResponse } from "msw";

import { LoginSchema, RegisterSchema } from "@/lib/schemas";

import { mockUsers, authHelpers } from "../data/auth";

/**
 * MSW handlers for authentication endpoints
 *
 * Provides comprehensive mocking for login and registration flows
 * with realistic responses, error handling, and edge cases.
 */

export const authHandlers = [
  /**
   * POST /api/auth/login - User Login
   *
   * Handles user authentication with realistic validation
   * and returns appropriate JWT tokens or error responses.
   */
  http.post("/api/auth/login", async ({ request }) => {
    try {
      const body = await request.json();

      // Validate request body with Zod schema
      const parseResult = LoginSchema.safeParse(body);

      if (!parseResult.success) {
        const firstError = parseResult.error.issues[0];
        return HttpResponse.json(
          { detail: firstError.message },
          { status: 400 },
        );
      }

      const { email, password } = parseResult.data;

      // Simulate server-side validation delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Validate credentials
      const user = authHelpers.validateCredentials(email, password);

      if (!user) {
        return HttpResponse.json(
          { detail: "Invalid email or password" },
          { status: 401 },
        );
      }

      // Return successful login response
      return HttpResponse.json(
        { access_token: user.token },
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error("MSW Login Handler Error:", error);
      return HttpResponse.json(
        { detail: "Internal server error" },
        { status: 500 },
      );
    }
  }),

  /**
   * POST /api/auth/register - User Registration
   *
   * Handles user registration with email uniqueness validation
   * and returns appropriate responses for various scenarios.
   */
  http.post("/api/auth/register", async ({ request }) => {
    try {
      const body = await request.json();

      // Validate request body with Zod schema
      const parseResult = RegisterSchema.safeParse(body);

      if (!parseResult.success) {
        const firstError = parseResult.error.issues[0];
        return HttpResponse.json(
          { detail: firstError.message },
          { status: 400 },
        );
      }

      const { email } = parseResult.data;

      // Simulate server-side processing delay
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Check if email already exists
      if (authHelpers.emailExists(email)) {
        return HttpResponse.json(
          { detail: "Email já está em uso" },
          { status: 409 },
        );
      }

      // Simulate user creation (in real app, this would create DB record)
      const newUserId = Math.max(...mockUsers.map((u) => u.id)) + 1;
      // Return successful registration response
      return HttpResponse.json(
        {
          message: "Usuário registrado com sucesso",
          user: {
            id: newUserId,
            email: email,
          },
        },
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error("MSW Register Handler Error:", error);
      return HttpResponse.json(
        { detail: "Internal server error" },
        { status: 500 },
      );
    }
  }),

  /**
   * GET /api/auth/me - Get Current User
   *
   * Validates JWT token and returns user information.
   * Useful for testing protected routes and authentication state.
   */
  http.get("/api/auth/me", async ({ request }) => {
    try {
      const authHeader = request.headers.get("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return HttpResponse.json(
          { detail: "Authorization header required" },
          { status: 401 },
        );
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Check if token is expired
      if (authHelpers.isTokenExpired(token)) {
        return HttpResponse.json({ detail: "Token expired" }, { status: 401 });
      }

      // Find user by token
      const user = mockUsers.find((u) => u.token === token);

      if (!user) {
        return HttpResponse.json({ detail: "Invalid token" }, { status: 401 });
      }

      // Return user information (without sensitive data)
      return HttpResponse.json(
        {
          user: {
            id: user.id,
            email: user.email,
            role: user.role || "user",
          },
        },
        { status: 200 },
      );
    } catch (error) {
      console.error("MSW Auth Me Handler Error:", error);
      return HttpResponse.json(
        { detail: "Internal server error" },
        { status: 500 },
      );
    }
  }),

  /**
   * POST /api/auth/logout - User Logout
   *
   * Simulates server-side logout (token invalidation).
   * In real implementation, this might blacklist the token.
   */
  http.post("/api/auth/logout", async ({ request }) => {
    try {
      const authHeader = request.headers.get("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return HttpResponse.json(
          { detail: "Authorization header required" },
          { status: 401 },
        );
      }

      // Simulate logout processing
      await new Promise((resolve) => setTimeout(resolve, 50));

      return HttpResponse.json(
        { message: "Logout realizado com sucesso" },
        { status: 200 },
      );
    } catch (error) {
      console.error("MSW Logout Handler Error:", error);
      return HttpResponse.json(
        { detail: "Internal server error" },
        { status: 500 },
      );
    }
  }),
];

/**
 * Test-specific handlers for edge cases and error scenarios
 * These can be used to override default handlers in specific tests
 */
export const authErrorHandlers = {
  /**
   * Network error simulation
   */
  networkError: http.post("/api/auth/login", () => {
    return HttpResponse.error();
  }),

  /**
   * Server error simulation
   */
  serverError: http.post("/api/auth/login", () => {
    return HttpResponse.json(
      { detail: "Database connection failed" },
      { status: 500 },
    );
  }),

  /**
   * Slow network simulation
   */
  slowNetwork: http.post("/api/auth/login", async ({ request }) => {
    // Simulate slow network (3 seconds delay)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const body = await request.json();
    // Validate request body with Zod schema
    const parseResult = LoginSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0];
      return HttpResponse.json({ detail: firstError.message }, { status: 400 });
    }
    const { email, password } = parseResult.data;

    const user = authHelpers.validateCredentials(email, password);

    if (!user) {
      return HttpResponse.json(
        { detail: "Invalid email or password" },
        { status: 401 },
      );
    }

    return HttpResponse.json({ access_token: user.token }, { status: 200 });
  }),

  /**
   * Rate limiting simulation
   */
  rateLimited: http.post("/api/auth/login", () => {
    return HttpResponse.json(
      { detail: "Too many login attempts. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
        },
      },
    );
  }),
};

