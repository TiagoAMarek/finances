import { Page } from '@playwright/test';

/**
 * Authentication helpers for visual regression tests
 */

export interface MockUser {
  email: string;
  password: string;
  name: string;
}

/**
 * Mock user for testing
 */
export const mockUser: MockUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
};

/**
 * Login helper that uses the login page
 * @param page - Playwright page instance
 * @param user - User credentials (optional, defaults to mockUser)
 */
export async function login(page: Page, user: MockUser = mockUser): Promise<void> {
  // Navigate to login page
  await page.goto('/login');
  
  // Fill in the form
  await page.fill('input[type="email"]', user.email);
  await page.fill('input[type="password"]', user.password);
  
  // Submit the form
  await page.click('button[type="submit"]');
  
  // Wait for navigation to dashboard or another page
  await page.waitForURL(/\/(dashboard|accounts|transactions)/, { timeout: 10000 });
}

/**
 * Setup authentication by directly setting localStorage
 * This is faster than going through the login flow
 * @param page - Playwright page instance
 */
export async function setupAuth(page: Page): Promise<void> {
  // Mock JWT token for testing
  const mockToken = 'mock-jwt-token-for-visual-testing';
  
  // Set the token in localStorage before navigating
  await page.addInitScript((token) => {
    localStorage.setItem('access_token', token);
  }, mockToken);
}

/**
 * Logout helper
 * @param page - Playwright page instance
 */
export async function logout(page: Page): Promise<void> {
  // Clear localStorage
  await page.evaluate(() => {
    localStorage.clear();
  });
  
  // Navigate to login page
  await page.goto('/login');
}

/**
 * Wait for page to be fully loaded including API calls
 * @param page - Playwright page instance
 * @param additionalWaitMs - Additional wait time in milliseconds
 */
export async function waitForPageLoad(page: Page, additionalWaitMs = 500): Promise<void> {
  // Wait for network to be idle
  await page.waitForLoadState('networkidle');
  
  // Wait for any pending animations to complete
  await page.waitForTimeout(additionalWaitMs);
}
