import { http, HttpResponse } from "msw";

import { UpdateProfileSchema, ChangePasswordSchema } from "@/lib/schemas/users";

import { userHelpers, mockUserProfiles } from "../data/users";

/**
 * MSW handlers for user profile endpoints
 *
 * Provides comprehensive mocking for profile management and password change
 * with realistic responses, validation, and error handling.
 */

export const userHandlers = [
  /**
   * GET /api/users/profile - Get User Profile
   *
   * Returns the authenticated user's profile information
   */
  http.get("/api/users/profile", async ({ request }) => {
    try {
      const authHeader = request.headers.get("Authorization");
      const userId = userHelpers.getUserIdFromAuth(authHeader);

      if (!userId) {
        return HttpResponse.json(
          { detail: "Não autorizado" },
          { status: 401 },
        );
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      const profile = userHelpers.findProfileByUserId(userId);

      if (!profile) {
        return HttpResponse.json(
          { detail: "Usuário não encontrado" },
          { status: 404 },
        );
      }

      return HttpResponse.json(profile, { status: 200 });
    } catch (error) {
      console.error("MSW Get Profile Handler Error:", error);
      return HttpResponse.json(
        { detail: "Erro interno do servidor" },
        { status: 500 },
      );
    }
  }),

  /**
   * PATCH /api/users/profile - Update User Profile
   *
   * Updates the authenticated user's name and email
   * with validation and uniqueness checking
   */
  http.patch("/api/users/profile", async ({ request }) => {
    try {
      const authHeader = request.headers.get("Authorization");
      const userId = userHelpers.getUserIdFromAuth(authHeader);

      if (!userId) {
        return HttpResponse.json(
          { detail: "Não autorizado" },
          { status: 401 },
        );
      }

      const body = await request.json();

      // Validate request body with Zod schema
      const parseResult = UpdateProfileSchema.safeParse(body);

      if (!parseResult.success) {
        const firstError = parseResult.error.issues[0];
        return HttpResponse.json(
          { detail: firstError.message },
          { status: 400 },
        );
      }

      const { name, email } = parseResult.data;

      // Check if email is already taken by another user
      if (userHelpers.isEmailTaken(email, userId)) {
        return HttpResponse.json(
          { detail: "Este email já está sendo usado por outro usuário" },
          { status: 400 },
        );
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Find and update the profile
      const profile = mockUserProfiles.find((p) => p.id === userId);

      if (!profile) {
        return HttpResponse.json(
          { detail: "Usuário não encontrado" },
          { status: 404 },
        );
      }

      // Update profile (in-memory for mock purposes)
      profile.name = name;
      profile.email = email;

      return HttpResponse.json(profile, { status: 200 });
    } catch (error) {
      console.error("MSW Update Profile Handler Error:", error);
      return HttpResponse.json(
        { detail: "Erro interno do servidor" },
        { status: 500 },
      );
    }
  }),

  /**
   * POST /api/users/change-password - Change Password
   *
   * Changes the authenticated user's password after verifying
   * the current password and validating the new password
   */
  http.post("/api/users/change-password", async ({ request }) => {
    try {
      const authHeader = request.headers.get("Authorization");
      const userId = userHelpers.getUserIdFromAuth(authHeader);

      if (!userId) {
        return HttpResponse.json(
          { detail: "Não autorizado" },
          { status: 401 },
        );
      }

      const body = await request.json();

      // Validate request body with Zod schema
      const parseResult = ChangePasswordSchema.safeParse(body);

      if (!parseResult.success) {
        const firstError = parseResult.error.issues[0];
        return HttpResponse.json(
          { detail: firstError.message },
          { status: 400 },
        );
      }

      const { currentPassword } = parseResult.data;

      // Verify current password
      if (!userHelpers.verifyPassword(userId, currentPassword)) {
        return HttpResponse.json(
          { detail: "Senha atual incorreta" },
          { status: 400 },
        );
      }

      // Simulate processing delay
      await new Promise((resolve) => setTimeout(resolve, 200));

      // In a real app, this would hash and update the password in the database
      return HttpResponse.json(
        { message: "Senha alterada com sucesso" },
        { status: 200 },
      );
    } catch (error) {
      console.error("MSW Change Password Handler Error:", error);
      return HttpResponse.json(
        { detail: "Erro interno do servidor" },
        { status: 500 },
      );
    }
  }),
];

/**
 * Test-specific handlers for edge cases and error scenarios
 */
export const userErrorHandlers = {
  /**
   * Network error simulation
   */
  networkError: http.get("/api/users/profile", () => {
    return HttpResponse.error();
  }),

  /**
   * Server error simulation
   */
  serverError: http.get("/api/users/profile", () => {
    return HttpResponse.json(
      { detail: "Database connection failed" },
      { status: 500 },
    );
  }),

  /**
   * User not found simulation
   */
  userNotFound: http.get("/api/users/profile", () => {
    return HttpResponse.json(
      { detail: "Usuário não encontrado" },
      { status: 404 },
    );
  }),
};
