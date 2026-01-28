import { test as base, Page } from '@playwright/test';
import { test } from '../fixtures/visual-test';

/**
 * Test Matrix Utility
 * 
 * Reduces code duplication by generating tests across multiple configurations
 * Instead of writing separate tests for mobile/tablet/desktop/dark, define once!
 */

export interface TestConfig {
  name: string;
  viewport?: 'mobile' | 'tablet' | 'desktop';
  theme?: 'light' | 'dark';
  authenticated?: boolean;
}

export interface TestMatrix {
  describe: string;
  configs: TestConfig[];
  testFn: (config: TestConfig, page: Page) => Promise<void>;
}

/**
 * Create a test matrix that runs the same test across multiple configurations
 * 
 * @example
 * ```ts
 * createTestMatrix({
 *   describe: 'Login Page',
 *   configs: [
 *     { name: 'default', viewport: 'desktop' },
 *     { name: 'mobile', viewport: 'mobile' },
 *     { name: 'dark', viewport: 'desktop', theme: 'dark' },
 *   ],
 *   testFn: async (config, page) => {
 *     await page.goto('/login');
 *     await preparePageForVisualTest(page);
 *     await takeVisualSnapshot(page, { name: `login-${config.name}` });
 *   },
 * });
 * ```
 */
export function createTestMatrix(matrix: TestMatrix): void {
  base.describe(matrix.describe, () => {
    matrix.configs.forEach((config) => {
      test(`should match baseline - ${config.name}`, async ({
        page,
        authenticatedPage,
        authenticatedMobilePage,
        authenticatedTabletPage,
        authenticatedDarkPage,
        mobilePage,
        tabletPage,
        desktopPage,
        darkModePage,
      }) => {
        // Determine which fixture to use based on config
        let selectedPage: Page;
        
        if (config.authenticated && config.viewport === 'mobile') {
          selectedPage = authenticatedMobilePage;
        } else if (config.authenticated && config.viewport === 'tablet') {
          selectedPage = authenticatedTabletPage;
        } else if (config.authenticated && config.theme === 'dark') {
          selectedPage = authenticatedDarkPage;
        } else if (config.authenticated) {
          selectedPage = authenticatedPage;
        } else if (config.viewport === 'mobile') {
          selectedPage = mobilePage;
        } else if (config.viewport === 'tablet') {
          selectedPage = tabletPage;
        } else if (config.viewport === 'desktop') {
          selectedPage = desktopPage;
        } else if (config.theme === 'dark') {
          selectedPage = darkModePage;
        } else {
          selectedPage = page;
        }
        
        await matrix.testFn(config, selectedPage);
      });
    });
  });
}

/**
 * Predefined viewport configurations
 */
export const VIEWPORT_CONFIGS: TestConfig[] = [
  { name: 'desktop', viewport: 'desktop' },
  { name: 'tablet', viewport: 'tablet' },
  { name: 'mobile', viewport: 'mobile' },
];

/**
 * Predefined theme configurations (desktop only)
 */
export const THEME_CONFIGS: TestConfig[] = [
  { name: 'light', viewport: 'desktop', theme: 'light' },
  { name: 'dark', viewport: 'desktop', theme: 'dark' },
];

/**
 * Standard config: desktop + mobile
 */
export const STANDARD_CONFIGS: TestConfig[] = [
  { name: 'default', viewport: 'desktop' },
  { name: 'mobile', viewport: 'mobile' },
];

/**
 * Full config: all viewports + dark mode
 */
export const FULL_CONFIGS: TestConfig[] = [
  { name: 'desktop', viewport: 'desktop' },
  { name: 'tablet', viewport: 'tablet' },
  { name: 'mobile', viewport: 'mobile' },
  { name: 'dark', viewport: 'desktop', theme: 'dark' },
];

/**
 * Create authenticated test matrix
 */
export function createAuthenticatedTestMatrix(
  describe: string,
  configs: TestConfig[],
  testFn: (config: TestConfig, page: Page) => Promise<void>
): void {
  const authenticatedConfigs = configs.map(c => ({ ...c, authenticated: true }));
  createTestMatrix({ describe, configs: authenticatedConfigs, testFn });
}

/**
 * Helper: Standard authenticated page tests (desktop + mobile)
 */
export function testAuthenticatedPage(
  describe: string,
  route: string,
  snapshotPrefix: string,
  options?: { charts?: boolean }
): void {
  createAuthenticatedTestMatrix(
    describe,
    STANDARD_CONFIGS,
    async (config, page) => {
      const { waitForPageLoad } = await import('../utils/auth');
      const { preparePageForVisualTest, takeVisualSnapshot } = await import('../utils/visual');
      
      await page.goto(route);
      await waitForPageLoad(page, options);
      await preparePageForVisualTest(page);
      await takeVisualSnapshot(page, {
        name: `${snapshotPrefix}-${config.name}`,
        fullPage: true,
      });
    }
  );
}

/**
 * Helper: Standard unauthenticated page tests (desktop + mobile)
 */
export function testUnauthenticatedPage(
  describe: string,
  route: string,
  snapshotPrefix: string
): void {
  createTestMatrix({
    describe,
    configs: STANDARD_CONFIGS,
    testFn: async (config, page) => {
      const { preparePageForVisualTest, takeVisualSnapshot } = await import('../utils/visual');
      
      await page.goto(route);
      await preparePageForVisualTest(page);
      await takeVisualSnapshot(page, {
        name: `${snapshotPrefix}-${config.name}`,
        fullPage: true,
      });
    },
  });
}
