import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/auth/login/route';
import { hashPassword } from '@/app/api/lib/auth';
import { createMockRequest } from '../../../helpers/auth-helpers';

// Mock database responses
const mockUsers: any[] = [];
let mockDbSelect: any;

// Mock the database module with simpler approach
vi.mock('@/app/api/lib/db', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(() => mockDbSelect())
        }))
      }))
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: vi.fn(() => [{ id: 1, email: 'test@example.com', hashedPassword: 'hash' }])
      }))
    }))
  }
}));

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    // Clear mock users before each test
    mockUsers.length = 0;
    
    // Reset database select mock
    mockDbSelect = vi.fn(() => []);
  });

  it('autentica usuário com credenciais válidas', async () => {
    // Arrange: Setup mock user
    const email = 'user@example.com';
    const password = '123456';
    const hashedPassword = await hashPassword(password);
    
    const mockUser = { id: 1, email, hashedPassword };
    mockDbSelect = vi.fn(() => [mockUser]);

    // Act: Make login request
    const request = createMockRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('access_token');
    expect(typeof data.access_token).toBe('string');
    expect(data.access_token.length).toBeGreaterThan(0);
  });

  it('rejeita login com email inexistente', async () => {
    // Arrange: Empty database (no user)
    mockDbSelect = vi.fn(() => []);

    // Act: Try to login with non-existent user
    const request = createMockRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: {
        email: 'inexistente@example.com',
        password: '123456',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data).toHaveProperty('detail');
    expect(data.detail).toBe('Invalid email or password');
  });

  it('rejeita login com senha incorreta', async () => {
    // Arrange: Setup mock user with different password
    const email = 'user@example.com';
    const correctPassword = '123456';
    const wrongPassword = 'senha-errada';
    const hashedPassword = await hashPassword(correctPassword);

    const mockUser = { id: 1, email, hashedPassword };
    mockDbSelect = vi.fn(() => [mockUser]);

    // Act: Try to login with wrong password
    const request = createMockRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: { email, password: wrongPassword },
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(401);
    expect(data).toHaveProperty('detail');
    expect(data.detail).toBe('Invalid email or password');
  });

  it('rejeita request com dados inválidos (email malformado)', async () => {
    // Act: Try to login with invalid email format
    const request = createMockRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: {
        email: 'email-inválido',
        password: '123456',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data).toHaveProperty('detail');
    expect(data.detail).toContain('Formato de email inválido');
  });

  it('rejeita request com senha vazia', async () => {
    // Act: Try to login with empty password
    const request = createMockRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: {
        email: 'user@example.com',
        password: '',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data).toHaveProperty('detail');
    expect(data.detail).toContain('Senha é obrigatória');
  });

  it('rejeita request com dados ausentes', async () => {
    // Act: Try to login with missing data
    const request = createMockRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: { email: 'user@example.com' }, // missing password
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data).toHaveProperty('detail');
    expect(typeof data.detail).toBe('string');
  });

  it('rejeita request com JSON inválido', async () => {
    // Act: Try to send invalid JSON
    const request = createMockRequest('http://localhost/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid-json',
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert - JSON parsing errors return 500, which is acceptable
    expect(response.status).toBe(500);
    expect(data).toHaveProperty('detail');
  });

  it('verifica que token JWT contém dados corretos do usuário', async () => {
    // Arrange: Setup mock user
    const email = 'user@example.com';
    const password = '123456';
    const hashedPassword = await hashPassword(password);
    
    const mockUser = { id: 1, email, hashedPassword };
    mockDbSelect = vi.fn(() => [mockUser]);

    // Act: Make login request
    const request = createMockRequest('http://localhost/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    const response = await POST(request);
    const data = await response.json();

    // Assert token contains correct user data
    expect(response.status).toBe(200);
    expect(data.access_token).toBeDefined();

    // Verify token payload (we can decode it without verification for testing)
    const tokenPayload = JSON.parse(
      Buffer.from(data.access_token.split('.')[1], 'base64').toString()
    );
    
    expect(tokenPayload.userId).toBe(mockUser.id);
    expect(tokenPayload.email).toBe(email);
    expect(tokenPayload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000)); // Token should not be expired
  });
});