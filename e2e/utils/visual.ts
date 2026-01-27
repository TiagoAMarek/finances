import { Page, expect } from '@playwright/test';

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
   */
  fullPage?: boolean;
  
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
   */
  waitMs?: number;
}

/**
 * Take a visual regression screenshot with consistent settings
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
    hideSelectors = [],
    maskSelectors = [],
    waitMs = 0,
  } = options;

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

  // Wait for any additional time if specified
  if (waitMs > 0) {
    await page.waitForTimeout(waitMs);
  }

  // Prepare mask options
  const mask = maskSelectors.length > 0 
    ? maskSelectors.map(selector => page.locator(selector)).filter(locator => locator)
    : undefined;

  // Take screenshot and compare
  await expect(page).toHaveScreenshot(`${name}.png`, {
    fullPage,
    mask,
    animations: 'disabled',
  });
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
 * @param page - Playwright page instance
 */
export async function waitForImages(page: Page): Promise<void> {
  await page.evaluate(() => {
    return Promise.all(
      Array.from(document.images)
        .filter((img) => !img.complete)
        .map((img) => {
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve; // Resolve even on error to not block
          });
        })
    );
  });
}

/**
 * Wait for fonts to be loaded
 * @param page - Playwright page instance
 */
export async function waitForFonts(page: Page): Promise<void> {
  await page.evaluate(() => {
    return (document as Document & { fonts?: { ready?: Promise<unknown> } }).fonts?.ready;
  });
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
 * Prepare page for visual testing with all common optimizations
 * @param page - Playwright page instance
 */
export async function preparePageForVisualTest(page: Page): Promise<void> {
  // Wait for network to be idle
  await page.waitForLoadState('networkidle');
  
  // Wait for images
  await waitForImages(page);
  
  // Wait for fonts
  await waitForFonts(page);
  
  // Hide scrollbars
  await hideScrollbars(page);
  
  // Wait a bit more for any animations to complete
  await page.waitForTimeout(500);
}
