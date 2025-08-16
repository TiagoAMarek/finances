import { vi, beforeAll, beforeEach, afterEach, afterAll } from 'vitest'
import '@testing-library/jest-dom'

// Mock environment variables for testing
vi.stubEnv('JWT_SECRET', 'test-jwt-secret-key')
vi.stubEnv('DATABASE_URL', ':memory:')

// Global test setup - runs once before all tests
beforeAll(() => {
  // Set timezone for consistent date testing
  process.env.TZ = 'UTC'
})

// Setup that runs before each test
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks()
})

// Cleanup after each test
afterEach(() => {
  // Additional cleanup if needed
})

// Global cleanup - runs once after all tests
afterAll(() => {
  // Cleanup resources
})