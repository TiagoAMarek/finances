import { Page, expect, Locator } from '@playwright/test';
import {
  waitForChartsToRender,
  waitForImagesToLoad,
  waitForFontsToLoad,
  smartWait,
} from './smart-wait';
import { SNAPSHOT_TOLERANCES } from '../config/constants';

/**
 * Visual testing utilities for consistent screenshot capture
 */

export interface ScreenshotOptions {
  /**
   * Name for the screenshot file
   */
  name: string;
  
  /**
   * Whether to capture full page (default: true)
   * @deprecated Consider using component-level screenshots for better performance
   */
  fullPage?: boolean;
  
  /**
   * Specific element selector to screenshot (component-level)
   * When provided, only this element will be captured
   */
  selector?: string;
  
  /**
   * Hide elements matching these selectors before screenshot
   */
  hideSelectors?: string[];
  
  /**
   * Mask elements matching these selectors (for dynamic content)
   */
  maskSelectors?: string[];
  
  /**
   * Additional wait time before screenshot (ms)
   * @deprecated Use smart waits instead
   */
  waitMs?: number;
  
  /**
   * Comparison tolerance level
   */
  tolerance?: 'strict' | 'normal' | 'relaxed';
}

/**
 * Take a visual regression screenshot with consistent settings
 * Supports both full-page and component-level screenshots
 * @param page - Playwright page instance
 * @param options - Screenshot options
 */
export async function takeVisualSnapshot(
  page: Page,
  options: ScreenshotOptions
): Promise<void> {
  const {
    name,
    fullPage = true,
    selector,
    hideSelectors = [],
    maskSelectors = [],
    waitMs = 0,
    tolerance = 'normal',
  } = options;

  try {
    // Hide elements that shouldn't be in screenshots
    if (hideSelectors.length > 0) {
      await Promise.all(
        hideSelectors.map((selector) =>
          page.locator(selector).evaluateAll((elements) => {
            elements.forEach((el) => {
              (el as HTMLElement).style.visibility = 'hidden';
            });
          }).catch(() => {
            // Ignore if selector doesn't match any elements
          })
        )
      );
    }

    // Wait for any additional time if specified (deprecated, use smart waits instead)
    if (waitMs > 0) {
      await page.waitForTimeout(waitMs);
    }

    // Prepare mask options
    const mask = maskSelectors.length > 0 
      ? maskSelectors.map(selector => page.locator(selector)).filter(locator => locator)
      : undefined;

    // Get tolerance settings
    const toleranceSettings = SNAPSHOT_TOLERANCES[tolerance.toUpperCase() as keyof typeof SNAPSHOT_TOLERANCES];

    // Take screenshot - either component-level or full-page
    if (selector) {
      // Component-level screenshot (faster, smaller files)
      const element = page.locator(selector);
      await element.waitFor({ state: 'visible', timeout: 5000 });
      
      await expect(element).toHaveScreenshot(`${name}.png`, {
        mask,
        animations: 'disabled',
        timeout: 10000,
        ...toleranceSettings,
      });
    } else {
      // Full-page screenshot (legacy behavior)
      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage,
        mask,
        animations: 'disabled',
        timeout: 10000,
        ...toleranceSettings,
      });
    }
  } catch (error: any) {
    // Enhanced error message with debug hints
    const url = page.url();
    const viewport = page.viewportSize();
    const projectName = process.env.PLAYWRIGHT_PROJECT_NAME || 'unknown';
    
    const errorMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ Visual Regression Test Failed: "${name}"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Test Details:
   URL: ${url}
   Viewport: ${viewport?.width}x${viewport?.height}
   Project: ${projectName}
   Type: ${selector ? 'Component' : 'Full Page'}
   ${selector ? `Selector: ${selector}` : ''}

🔍 What Happened:
   ${error.message}

💡 Debug Hints:
   1. View visual diff: pnpm test:visual:report
   2. Update baseline: pnpm test:visual:update
   3. Run specific test: npx playwright test -g "${name}"
   4. Debug mode: npx playwright test --debug -g "${name}"

🛠️  Common Causes:
   ${selector ? '• Component selector not found or not visible' : ''}
   ${selector ? '• Component rendered differently than expected' : ''}
   • Intentional UI change (update baseline if correct)
   • Font rendering differences between environments
   • Animation/timing issue (check if smart waits are used)
   • Dynamic content not properly masked

📚 More Info:
   - e2e/README.md - Testing guide
   - e2e/IMPROVEMENTS_SUMMARY.md - Best practices
   
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    throw new Error(errorMessage);
  }
}

/**
 * Common selectors to hide in screenshots (dynamic content)
 */
export const commonHideSelectors = [
  // Time-dependent elements
  '[data-testid="current-time"]',
  '.timestamp',
  
  // Loading spinners
  '[data-testid="loading-spinner"]',
  '.loading-spinner',
];

/**
 * Common selectors to mask in screenshots
 */
export const commonMaskSelectors = [
  // User-specific data that might change
  '[data-testid="user-avatar"]',
  
  // Timestamps and dates that change
  'time[datetime]',
  
  // Dynamic IDs
  '[data-transaction-id]',
  '[data-account-id]',
  '[data-card-id]',
];

/**
 * Wait for all images to load
 * @deprecated Use waitForImagesToLoad from smart-wait.ts instead
 * @param page - Playwright page instance
 */
export async function waitForImages(page: Page): Promise<void> {
  await waitForImagesToLoad(page);
}

/**
 * Wait for fonts to be loaded
 * @deprecated Use waitForFontsToLoad from smart-wait.ts instead
 * @param page - Playwright page instance
 */
export async function waitForFonts(page: Page): Promise<void> {
  await waitForFontsToLoad(page);
}

/**
 * Hide scrollbars for consistent screenshots
 * @param page - Playwright page instance
 */
export async function hideScrollbars(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      * {
        scrollbar-width: none !important;
      }
      *::-webkit-scrollbar {
        display: none !important;
      }
    `,
  });
}

/**
 * Hide Next.js development mode indicators (build button, error overlay, etc.)
 * These elements appear only in dev mode and would cause visual regression test failures
 * @param page - Playwright page instance
 */
export async function hideNextJsDevIndicators(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      /* Hide Next.js dev mode build indicator button */
      #__next-build-watcher,
      [id^="__next"],
      [class*="__next"],
      [data-nextjs-toast-errors-parent],
      [data-nextjs-dialog-overlay],
      [id*="nextjs"],
      .__next-dev-overlay,
      nextjs-portal {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
    `,
  });
}

/**
 * Disable all animations including Recharts animations
 * @param page - Playwright page instance
 */
export async function disableAnimations(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });
  
  // Disable Recharts animations specifically
  await page.evaluate(() => {
    // Override matchMedia to force prefers-reduced-motion
    const originalMatchMedia = window.matchMedia;
    if (originalMatchMedia) {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => {
          if (query === '(prefers-reduced-motion: reduce)') {
            return {
              matches: true,
              media: query,
              onchange: null,
              addEventListener: () => {},
              removeEventListener: () => {},
              dispatchEvent: () => true,
            };
          }
          return originalMatchMedia.call(window, query);
        },
      });
    }
  });
}

/**
 * Wait for MSW to be fully initialized
 * @param page - Playwright page instance
 */
export async function waitForMSW(page: Page): Promise<void> {
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
 * Prepare page for visual testing with all common optimizations
 * Uses smart waiting instead of fixed timeouts for better performance
 * @param page - Playwright page instance
 */
export async function preparePageForVisualTest(page: Page): Promise<void> {
  // Wait for MSW to be fully initialized (if enabled)
  await waitForMSW(page);
  
  // Wait for network to be idle
  await page.waitForLoadState('networkidle');
  
  // Hide Next.js development mode indicators
  await hideNextJsDevIndicators(page);
  
  // Disable all animations (including Recharts)
  await disableAnimations(page);
  
  // Hide scrollbars
  await hideScrollbars(page);
  
  // Check if page has charts
  const hasCharts = await page.locator('.recharts-wrapper').count() > 0;
  
  // Use smart wait that waits only as long as needed
  await smartWait(page, {
    images: true,
    fonts: true,
    charts: hasCharts,
    animations: false, // Already disabled above
  });
}

/**
 * Take a component-level screenshot (faster alternative to full-page screenshots)
 * This is 70-80% faster and produces much smaller files
 * 
 * @param page - Playwright page instance
 * @param selector - CSS selector for the component
 * @param name - Screenshot name
 * @param options - Additional screenshot options
 * 
 * @example
 * ```ts
 * await takeComponentSnapshot(page, '[data-testid="summary-cards"]', 'dashboard-summary');
 * ```
 */
export async function takeComponentSnapshot(
  page: Page,
  selector: string,
  name: string,
  options?: Omit<ScreenshotOptions, 'name' | 'selector'>
): Promise<void> {
  await takeVisualSnapshot(page, {
    name,
    selector,
    fullPage: false,
    ...options,
  });
}

/**
 * Helper to take multiple component snapshots efficiently
 * Takes multiple component screenshots in parallel for better performance
 * 
 * @example
 * ```ts
 * await takeMultipleComponentSnapshots(page, [
 *   { selector: '[data-testid="summary-cards"]', name: 'dashboard-summary' },
 *   { selector: '[data-testid="charts"]', name: 'dashboard-charts' },
 * ]);
 * ```
 */
export async function takeMultipleComponentSnapshots(
  page: Page,
  components: Array<{ selector: string; name: string; options?: Omit<ScreenshotOptions, 'name' | 'selector'> }>
): Promise<void> {
  // Take all screenshots in parallel for maximum performance
  await Promise.all(
    components.map(({ selector, name, options }) =>
      takeComponentSnapshot(page, selector, name, options)
    )
  );
}

/**
 * Common component selectors for dashboard
 */
export const DASHBOARD_COMPONENTS = {
  SUMMARY_CARDS: '[data-testid="summary-cards"]',
  CHARTS_SECTION: '.recharts-wrapper',
  RESOURCES_SECTION: '[data-testid="resources-section"]',
  REPORTS_SECTION: '[data-testid="reports-section"]',
} as const;

/**
 * Common component selectors for forms
 */
export const FORM_COMPONENTS = {
  LOGIN_FORM: 'form[data-testid="login-form"]',
  REGISTER_FORM: 'form[data-testid="register-form"]',
  TRANSACTION_FORM: '[data-testid="transaction-form"]',
} as const;
