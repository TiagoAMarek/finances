import Database from "better-sqlite3";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { signToken } from "@/app/api/lib/auth";
import { GET, PATCH } from "@/app/api/users/profile/route";

import { createNextRequest } from "../helpers/auth-helpers";
import {
  createIntegrationTestDb,
  cleanupTestDb,
  createTestUser,
} from "../helpers/integration-db-helpers";

let testDb: any;
let sqlite: Database.Database;

// Mock the database module to use our test database
vi.mock("@/app/api/lib/db", () => ({
  get db() {
    return testDb;
  },
}));

describe("User Profile API - Integration Tests", () => {
  beforeEach(() => {
    const dbSetup = createIntegrationTestDb();
    testDb = dbSetup.db;
    sqlite = dbSetup.sqlite;
  });

  afterEach(() => {
    if (sqlite) {
      cleanupTestDb(sqlite);
      sqlite.close();
    }
  });

  describe("GET /api/users/profile", () => {
    it("retorna perfil do usuário autenticado", async () => {
      // Arrange: Create user and get token
      const { user } = await createTestUser(testDb, {
        name: "Test User",
        email: "test@example.com",
        password: "Test123!@#",
      });

      const token = await signToken({
        userId: user.id,
        email: user.email,
      });

      // Act: Get user profile
      const request = createNextRequest("http://localhost/api/users/profile", {
        method: "GET",
        token,
      });

      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({
        id: user.id,
        name: "Test User",
        email: "test@example.com",
      });
    });

    it("retorna 401 quando não autenticado", async () => {
      // Act: Try to get profile without token
      const request = createNextRequest("http://localhost/api/users/profile", {
        method: "GET",
      });

      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data.detail).toBe("Não autorizado");
    });

    it("retorna 404 quando usuário não existe", async () => {
      // Arrange: Create token for non-existent user
      const token = await signToken({
        userId: 999,
        email: "nonexistent@example.com",
      });

      // Act: Try to get profile
      const request = createNextRequest("http://localhost/api/users/profile", {
        method: "GET",
        token,
      });

      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.detail).toBe("Usuário não encontrado");
    });
  });

  describe("PATCH /api/users/profile", () => {
    it("atualiza perfil do usuário com sucesso", async () => {
      // Arrange: Create user and get token
      const { user } = await createTestUser(testDb, {
        name: "Old Name",
        email: "old@example.com",
        password: "Test123!@#",
      });

      const token = await signToken({
        userId: user.id,
        email: user.email,
      });

      // Act: Update profile
      const request = createNextRequest("http://localhost/api/users/profile", {
        method: "PATCH",
        token,
        body: {
          name: "New Name",
          email: "new@example.com",
        },
      });

      const response = await PATCH(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.name).toBe("New Name");
      expect(data.email).toBe("new@example.com");
    });

    it("retorna 401 quando não autenticado", async () => {
      // Act: Try to update profile without token
      const request = createNextRequest("http://localhost/api/users/profile", {
        method: "PATCH",
        body: {
          name: "New Name",
          email: "new@example.com",
        },
      });

      const response = await PATCH(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data.detail).toBe("Não autorizado");
    });

    it("rejeita atualização com email já existente", async () => {
      // Arrange: Create two users
      const { user: user1 } = await createTestUser(testDb, {
        name: "User 1",
        email: "user1@example.com",
        password: "Test123!@#",
      });

      await createTestUser(testDb, {
        name: "User 2",
        email: "user2@example.com",
        password: "Test123!@#",
      });

      const token = await signToken({
        userId: user1.id,
        email: user1.email,
      });

      // Act: Try to update user1's email to user2's email
      const request = createNextRequest("http://localhost/api/users/profile", {
        method: "PATCH",
        token,
        body: {
          name: "User 1",
          email: "user2@example.com", // This email is already taken
        },
      });

      const response = await PATCH(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.detail).toContain("email já está sendo usado");
    });

    it("permite atualizar nome sem alterar email", async () => {
      // Arrange: Create user
      const { user } = await createTestUser(testDb, {
        name: "Old Name",
        email: "test@example.com",
        password: "Test123!@#",
      });

      const token = await signToken({
        userId: user.id,
        email: user.email,
      });

      // Act: Update only name
      const request = createNextRequest("http://localhost/api/users/profile", {
        method: "PATCH",
        token,
        body: {
          name: "New Name",
          email: "test@example.com", // Same email
        },
      });

      const response = await PATCH(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.name).toBe("New Name");
      expect(data.email).toBe("test@example.com");
    });

    it("rejeita atualização com dados inválidos", async () => {
      // Arrange: Create user
      const { user } = await createTestUser(testDb, {
        name: "Test User",
        email: "test@example.com",
        password: "Test123!@#",
      });

      const token = await signToken({
        userId: user.id,
        email: user.email,
      });

      // Act: Try to update with invalid email
      const request = createNextRequest("http://localhost/api/users/profile", {
        method: "PATCH",
        token,
        body: {
          name: "Test User",
          email: "invalid-email", // Invalid email format
        },
      });

      const response = await PATCH(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data.detail).toBeTruthy();
    });
  });
});
