import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { POST } from "@/app/api/auth/login/route";
import Database from "better-sqlite3";
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

describe("POST /api/auth/login - Integration Tests", () => {
  beforeEach(() => {
    // Create a fresh database for each test
    const dbSetup = createIntegrationTestDb();
    testDb = dbSetup.db;
    sqlite = dbSetup.sqlite;
  });

  afterEach(() => {
    // Clean up after each test
    if (sqlite) {
      cleanupTestDb(sqlite);
      sqlite.close();
    }
  });

  it("autentica usuário existente com credenciais corretas", async () => {
    // Arrange: Create user in database
    const { user } = await createTestUser(testDb, {
      name: "User",
      email: "user@example.com",
      password: "Abcdef1!",
    });

    // Act: Make login request
    const request = createNextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: {
        email: "user@example.com",
        password: "Abcdef1!",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert API response
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("access_token");
    expect(typeof data.access_token).toBe("string");
    expect(data.access_token.length).toBeGreaterThan(0);

    // Verify token contains correct user data
    const tokenPayload = JSON.parse(
      Buffer.from(data.access_token.split(".")[1], "base64").toString(),
    );

    expect(tokenPayload.userId).toBe(user.id);
    expect(tokenPayload.email).toBe(user.email);
    expect(tokenPayload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it("rejeita login com email inexistente", async () => {
    // Act: Try to login with non-existent email
    const request = createNextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: {
        email: "inexistente@example.com",
        password: "123456",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data.detail).toBe("Invalid email or password");
  });

  it("rejeita login com senha incorreta", async () => {
    // Arrange: Create user in database
    await createTestUser(testDb, {
      name: "User",
      email: "user@example.com",
      password: "Abcdef1!",
    });

    // Act: Try to login with wrong password
    const request = createNextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: {
        email: "user@example.com",
        password: "senha-errada",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data.detail).toBe("Invalid email or password");
  });

  it("valida entrada com mensagens em português", async () => {
    // Act: Try to login with invalid email format
    const request = createNextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: {
        email: "email-inválido",
        password: "123456",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert validation error in Portuguese
    expect(response.status).toBe(400);
    expect(data.detail).toContain("Formato de email inválido");
  });

  it("verifica comparação de senha com hash real do banco", async () => {
    // Arrange: Create user with specific password
    const plainPassword = "MinhaSenha123!";
    const { user } = await createTestUser(testDb, {
      name: "User",
      email: "user@example.com",
      password: plainPassword,
    });

    // Verify user was saved with hashed password
    const savedUser = await testDb.query.users.findFirst({
      where: (users: any, { eq }: any) => eq(users.id, user.id),
    });
    expect(savedUser.hashedPassword).toBeTruthy();
    expect(savedUser.hashedPassword).not.toBe(plainPassword);

    // Act: Login with correct password
    const request = createNextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: {
        email: "user@example.com",
        password: plainPassword,
      },
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert login success
    expect(response.status).toBe(200);
    expect(data.access_token).toBeTruthy();
  });

  it("gera token JWT válido com expiração correta", async () => {
    // Arrange: Create user
    await createTestUser(testDb, {
      name: "User",
      email: "user@example.com",
      password: "Abcdef1!",
    });

    // Act: Login
    const loginTime = Math.floor(Date.now() / 1000);

    const request = createNextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: {
        email: "user@example.com",
        password: "Abcdef1!",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert token structure and content
    expect(response.status).toBe(200);
    expect(data.access_token).toBeTruthy();

    const tokenParts = data.access_token.split(".");
    expect(tokenParts).toHaveLength(3); // header.payload.signature

    const payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString());

    // Check token expiration (should be 24 hours from now)
    const expectedExp = loginTime + 24 * 60 * 60; // 24 hours
    expect(payload.exp).toBeGreaterThanOrEqual(expectedExp - 5); // Allow 5 second tolerance
    expect(payload.exp).toBeLessThanOrEqual(expectedExp + 5);

    expect(payload.userId).toBe(1); // First user should have ID 1
    expect(payload.email).toBe("user@example.com");
  });

  it("testa proteção contra timing attack (mesma mensagem de erro)", async () => {
    // This test ensures that both non-existent users and wrong passwords
    // return the same error message (basic timing attack protection)

    // Arrange: Create one real user
    await createTestUser(testDb, {
      name: "Real",
      email: "real@example.com",
      password: "Abcdef1!",
    });

    // Test non-existent user
    const request1 = createNextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: {
        email: "fake@example.com",
        password: "123456",
      },
    });
    const response1 = await POST(request1);

    // Test wrong password
    const request2 = createNextRequest("http://localhost/api/auth/login", {
      method: "POST",
      body: {
        email: "real@example.com",
        password: "wrong-password",
      },
    });
    const response2 = await POST(request2);

    // Assert both return same error status and message
    expect(response1.status).toBe(401);
    expect(response2.status).toBe(401);

    const data1 = await response1.json();
    const data2 = await response2.json();
    expect(data1.detail).toBe("Invalid email or password");
    expect(data2.detail).toBe("Invalid email or password");

    // Both responses should be indistinguishable to an attacker
    expect(data1).toEqual(data2);
  });

  it("testa comportamento com múltiplos usuários no banco", async () => {
    // Arrange: Create multiple users
    await createTestUser(testDb, {
      name: "User1",
      email: "user1@example.com",
      password: "Password1!",
    });

    await createTestUser(testDb, {
      name: "User2",
      email: "user2@example.com",
      password: "Password2!",
    });

    await createTestUser(testDb, {
      name: "User3",
      email: "user3@example.com",
      password: "Password3!",
    });

    // Act & Assert: Each user can login independently
    const testCases = [
      { email: "user1@example.com", password: "Password1!" },
      { email: "user2@example.com", password: "Password2!" },
      { email: "user3@example.com", password: "Password3!" },
    ];

    for (const testCase of testCases) {
      const request = createNextRequest("http://localhost/api/auth/login", {
        method: "POST",
        body: testCase,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.access_token).toBeTruthy();

      // Verify token contains correct user
      const payload = JSON.parse(
        Buffer.from(data.access_token.split(".")[1], "base64").toString(),
      );
      expect(payload.email).toBe(testCase.email);
    }
  });
});
