import { POST } from "@/app/api/auth/register/route";
import Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createNextRequest } from "../helpers/auth-helpers";
import {
  cleanupTestDb,
  createIntegrationTestDb,
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

describe("POST /api/auth/register - Integration Tests", () => {
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

  it.skip("registra usuário com sucesso no banco real", async () => {
    // Act: Make registration request
    const request = createNextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: {
        email: "newuser@example.com",
        password: "123456",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert API response
    expect(response.status).toBe(201);
    expect(data.message).toBe("Usuário registrado com sucesso");
    expect(data.user.email).toBe("newuser@example.com");
    expect(data.user).toHaveProperty("id");
    expect(data.user).not.toHaveProperty("hashedPassword");

    // Assert user was actually saved in database
    const savedUser = await testDb.query.users.findFirst({
      where: (users: any, { eq }: any) =>
        eq(users.email, "newuser@example.com"),
    });

    expect(savedUser).toBeTruthy();
    expect(savedUser.email).toBe("newuser@example.com");
    expect(savedUser.hashedPassword).toBeTruthy();
    expect(savedUser.hashedPassword).not.toBe("123456"); // Should be hashed
    expect(savedUser.hashedPassword.startsWith("$2")).toBe(true); // bcrypt hash format
  });

  it("impede registro de usuário duplicado no banco real", async () => {
    // Arrange: Create existing user in database
    await createTestUser(testDb, {
      email: "existing@example.com",
      password: "123456",
    });

    // Act: Try to register with same email
    const request = createNextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: {
        email: "existing@example.com",
        password: "different-password",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert API response
    expect(response.status).toBe(400);
    expect(data.detail).toBe("User with this email already exists");

    // Assert only one user exists in database
    const users = await testDb.query.users.findMany({
      where: (users: any, { eq }: any) =>
        eq(users.email, "existing@example.com"),
    });

    expect(users).toHaveLength(1);
  });

  it("valida dados de entrada com mensagens em português", async () => {
    // Act: Try to register with invalid email
    const request = createNextRequest("http://localhost/api/auth/register", {
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

    // Assert no user was created in database
    const users = await testDb.query.users.findMany();
    expect(users).toHaveLength(0);
  });

  it.skip("hasheia senha corretamente antes de salvar no banco", async () => {
    const plainPassword = "minha-senha-123";

    // Act: Register user
    const request = createNextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: {
        email: "user@example.com",
        password: plainPassword,
      },
    });

    const response = await POST(request);
    expect(response.status).toBe(201);

    // Assert password is hashed in database
    const savedUser = await testDb.query.users.findFirst({
      where: (users: any, { eq }: any) => eq(users.email, "user@example.com"),
    });

    expect(savedUser.hashedPassword).toBeTruthy();
    expect(savedUser.hashedPassword).not.toBe(plainPassword);
    expect(savedUser.hashedPassword.length).toBeGreaterThan(50); // bcrypt hashes are long
    expect(savedUser.hashedPassword.startsWith("$2")).toBe(true); // bcrypt format

    // Verify the password can be verified (using bcrypt directly)
    const bcrypt = await import("bcryptjs");
    const isValid = await bcrypt.compare(
      plainPassword,
      savedUser.hashedPassword,
    );
    expect(isValid).toBe(true);
  });

  it("gerencia erros de validação corretamente", async () => {
    // This test verifies error handling with malformed data
    const request = createNextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: {
        email: "valid@example.com",
        password: "", // Empty password should fail validation
      },
    });

    const response = await POST(request);
    const data = await response.json();

    // Should return validation error
    expect(response.status).toBe(400);
    expect(data.detail).toContain("Senha deve ter pelo menos 6 caracteres");

    // User should not exist in database
    const users = await testDb.query.users.findMany();
    expect(users).toHaveLength(0);
  });

  it.skip("retorna apenas campos seguros do usuário na resposta", async () => {
    // Act: Register user
    const request = createNextRequest("http://localhost/api/auth/register", {
      method: "POST",
      body: {
        email: "secure@example.com",
        password: "123456",
      },
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert API response only contains safe fields
    expect(response.status).toBe(201);
    expect(data.user).toEqual({
      id: expect.any(Number),
      email: "secure@example.com",
    });

    // Verify sensitive data is not leaked
    expect(data.user).not.toHaveProperty("hashedPassword");
    expect(data.user).not.toHaveProperty("password");
    expect(data).not.toHaveProperty("hashedPassword");
    expect(data).not.toHaveProperty("password");
  });
});
