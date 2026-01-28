import { Page } from '@playwright/test';
import { smartWait } from './smart-wait';

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
 * Wait for MSW to be fully initialized
 * @param page - Playwright page instance
 */
async function waitForMSW(page: Page): Promise<void> {
  try {
    // Wait for the MSW initialization message to disappear
    await page.waitForSelector('text=Initializing Mock Service Worker', { 
      state: 'hidden',
      timeout: 10000 
    });
  } catch (error) {
    // If the message never appeared, MSW might already be ready or not enabled
    // Continue anyway
  }
}

/**
 * Wait for page to be fully loaded including API calls
 * Uses smart waiting instead of fixed timeouts
 * @param page - Playwright page instance
 * @param options - Wait options
 */
export async function waitForPageLoad(page: Page, options?: {
  charts?: boolean;
}): Promise<void> {
  // Wait for MSW to be fully initialized (if enabled)
  await waitForMSW(page);
  
  // Wait for network to be idle
  await page.waitForLoadState('networkidle');
  
  // Use smart wait
  await smartWait(page, {
    images: true,
    fonts: true,
    charts: options?.charts || false,
  });
}
