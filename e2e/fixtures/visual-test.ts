import { test as base, Page } from '@playwright/test';
import { setupAuth } from '../utils/auth';
import { preparePageForVisualTest } from '../utils/visual';
import { VIEWPORTS, COLOR_SCHEME, TEST_USER } from '../config/constants';

/**
 * Extended test fixtures for visual regression testing
 * These fixtures eliminate repetitive setup code across tests
 */

type VisualTestFixtures = {
  /**
   * Authenticated page with auth token already set in localStorage
   * Use this instead of manually calling setupAuth()
   */
  authenticatedPage: Page;

  /**
   * Page with mobile viewport already configured
   */
  mobilePage: Page;

  /**
   * Page with tablet viewport already configured
   */
  tabletPage: Page;

  /**
   * Page with desktop viewport already configured
   */
  desktopPage: Page;

  /**
   * Page with dark mode enabled
   */
  darkModePage: Page;

  /**
   * Authenticated page with mobile viewport
   */
  authenticatedMobilePage: Page;

  /**
   * Authenticated page with tablet viewport
   */
  authenticatedTabletPage: Page;

  /**
   * Authenticated page with dark mode
   */
  authenticatedDarkPage: Page;

  /**
   * Page that's already prepared for visual testing
   * (animations disabled, scrollbars hidden, etc.)
   */
  preparedPage: Page;
};

export const test = base.extend<VisualTestFixtures>({
  // Base fixture: authenticated page
  authenticatedPage: async ({ page }, use) => {
    await setupAuth(page);
    await use(page);
  },

  // Viewport fixtures
  mobilePage: async ({ page }, use) => {
    await page.setViewportSize(VIEWPORTS.MOBILE);
    await use(page);
  },

  tabletPage: async ({ page }, use) => {
    await page.setViewportSize(VIEWPORTS.TABLET);
    await use(page);
  },

  desktopPage: async ({ page }, use) => {
    await page.setViewportSize(VIEWPORTS.DESKTOP);
    await use(page);
  },

  // Theme fixture
  darkModePage: async ({ page }, use) => {
    // Use Playwright's emulateMedia for more reliable dark mode
    await page.emulateMedia({ colorScheme: COLOR_SCHEME.DARK });
    await use(page);
  },

  // Combined fixtures: auth + viewport
  authenticatedMobilePage: async ({ page }, use) => {
    await setupAuth(page);
    await page.setViewportSize(VIEWPORTS.MOBILE);
    await use(page);
  },

  authenticatedTabletPage: async ({ page }, use) => {
    await setupAuth(page);
    await page.setViewportSize(VIEWPORTS.TABLET);
    await use(page);
  },

  // Combined fixtures: auth + theme
  authenticatedDarkPage: async ({ page }, use) => {
    await setupAuth(page);
    await page.emulateMedia({ colorScheme: COLOR_SCHEME.DARK });
    await use(page);
  },

  // Prepared page fixture
  preparedPage: async ({ page }, use) => {
    // Note: preparePageForVisualTest should be called after navigation
    // This fixture just provides the page, caller still needs to navigate and prepare
    await use(page);
  },
});

export { expect } from '@playwright/test';

/**
 * Helper function to create a test with specific configuration
 * 
 * @example
 * ```ts
 * createVisualTest('dashboard', {
 *   authenticated: true,
 *   viewport: 'mobile',
 *   theme: 'dark',
 * }, async ({ page }) => {
 *   await page.goto('/dashboard');
 *   await preparePageForVisualTest(page);
 *   await takeVisualSnapshot(page, { name: 'dashboard-mobile-dark' });
 * });
 * ```
 */
export function createVisualTest(
  name: string,
  config: {
    authenticated?: boolean;
    viewport?: 'mobile' | 'tablet' | 'desktop';
    theme?: 'light' | 'dark';
  },
  testFn: (args: { page: Page }) => Promise<void>
) {
  const { authenticated = false, viewport, theme } = config;

  // Determine which fixture to use
  let fixtureDescription = '';
  
  if (authenticated && viewport === 'mobile') {
    fixtureDescription = 'authenticatedMobilePage';
  } else if (authenticated && viewport === 'tablet') {
    fixtureDescription = 'authenticatedTabletPage';
  } else if (authenticated && theme === 'dark') {
    fixtureDescription = 'authenticatedDarkPage';
  } else if (authenticated) {
    fixtureDescription = 'authenticatedPage';
  } else if (viewport === 'mobile') {
    fixtureDescription = 'mobilePage';
  } else if (viewport === 'tablet') {
    fixtureDescription = 'tabletPage';
  } else if (viewport === 'desktop') {
    fixtureDescription = 'desktopPage';
  } else if (theme === 'dark') {
    fixtureDescription = 'darkModePage';
  }

  return test(name, async (fixtures) => {
    // @ts-expect-error - Dynamic fixture access
    const page = fixtureDescription ? fixtures[fixtureDescription] : fixtures.page;
    await testFn({ page });
  });
}
