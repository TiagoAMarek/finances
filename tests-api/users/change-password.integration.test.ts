import Database from "better-sqlite3";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { signToken } from "@/app/api/lib/auth";
import { POST } from "@/app/api/users/change-password/route";

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

describe("POST /api/users/change-password - Integration Tests", () => {
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

  it("altera senha com credenciais válidas", async () => {
    // Arrange: Create user
    const { user } = await createTestUser(testDb, {
      name: "Test User",
      email: "test@example.com",
      password: "OldPassword123!",
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
    });

    // Act: Change password
    const request = createNextRequest(
      "http://localhost/api/users/change-password",
      {
        method: "POST",
        token,
        body: {
          currentPassword: "OldPassword123!",
          newPassword: "NewPassword123!",
          confirmPassword: "NewPassword123!",
        },
      },
    );

    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data.message).toBe("Senha alterada com sucesso");
  });

  it("retorna 401 quando não autenticado", async () => {
    // Act: Try to change password without token
    const request = createNextRequest(
      "http://localhost/api/users/change-password",
      {
        method: "POST",
        body: {
          currentPassword: "OldPassword123!",
          newPassword: "NewPassword123!",
          confirmPassword: "NewPassword123!",
        },
      },
    );

    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data.detail).toBe("Não autorizado");
  });

  it("rejeita alteração com senha atual incorreta", async () => {
    // Arrange: Create user
    const { user } = await createTestUser(testDb, {
      name: "Test User",
      email: "test@example.com",
      password: "CorrectPassword123!",
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
    });

    // Act: Try to change password with wrong current password
    const request = createNextRequest(
      "http://localhost/api/users/change-password",
      {
        method: "POST",
        token,
        body: {
          currentPassword: "WrongPassword123!",
          newPassword: "NewPassword123!",
          confirmPassword: "NewPassword123!",
        },
      },
    );

    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.detail).toBe("Senha atual incorreta");
  });

  it("rejeita alteração quando senhas não coincidem", async () => {
    // Arrange: Create user
    const { user } = await createTestUser(testDb, {
      name: "Test User",
      email: "test@example.com",
      password: "OldPassword123!",
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
    });

    // Act: Try to change password with mismatched confirmation
    const request = createNextRequest(
      "http://localhost/api/users/change-password",
      {
        method: "POST",
        token,
        body: {
          currentPassword: "OldPassword123!",
          newPassword: "NewPassword123!",
          confirmPassword: "DifferentPassword123!", // Doesn't match
        },
      },
    );

    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.detail).toContain("senhas não coincidem");
  });

  it("rejeita senha fraca que não atende aos requisitos", async () => {
    // Arrange: Create user
    const { user } = await createTestUser(testDb, {
      name: "Test User",
      email: "test@example.com",
      password: "OldPassword123!",
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
    });

    // Act: Try to change to weak password
    const request = createNextRequest(
      "http://localhost/api/users/change-password",
      {
        method: "POST",
        token,
        body: {
          currentPassword: "OldPassword123!",
          newPassword: "weak", // Too short, no uppercase, no number, no special char
          confirmPassword: "weak",
        },
      },
    );

    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.detail).toBeTruthy(); // Should have validation error
  });

  it("retorna 404 quando usuário não existe", async () => {
    // Arrange: Create token for non-existent user
    const token = await signToken({
      userId: 999,
      email: "nonexistent@example.com",
    });

    // Act: Try to change password
    const request = createNextRequest(
      "http://localhost/api/users/change-password",
      {
        method: "POST",
        token,
        body: {
          currentPassword: "OldPassword123!",
          newPassword: "NewPassword123!",
          confirmPassword: "NewPassword123!",
        },
      },
    );

    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(404);
    expect(data.detail).toBe("Usuário não encontrado");
  });
});
