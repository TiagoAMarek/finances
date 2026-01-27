import { test } from '@playwright/test';
import { setupAuth, waitForPageLoad } from './utils/auth';
import { preparePageForVisualTest, takeVisualSnapshot } from './utils/visual';

/**
 * Visual regression tests for the Dashboard page
 * 
 * Tests capture screenshots of the dashboard in different states
 * and viewports to ensure consistent visual appearance.
 */

test.describe('Dashboard Page - Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    // Setup authentication for all dashboard tests
    await setupAuth(page);
  });

  test('should match baseline - default state', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'dashboard-default',
      fullPage: true,
    });
  });

  test('should match baseline - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'dashboard-mobile',
      fullPage: true,
    });
  });

  test('should match baseline - tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'dashboard-tablet',
      fullPage: true,
    });
  });

  test('should match baseline - with resources expanded', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    
    // Expand resources accordion
    const resourcesButton = page.getByRole('button', { name: /recursos/i });
    if (await resourcesButton.isVisible()) {
      await resourcesButton.click();
      await page.waitForTimeout(500); // Wait for animation
    }
    
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'dashboard-resources-expanded',
      fullPage: true,
    });
  });

  test('should match baseline - with reports expanded', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    
    // Expand reports accordion
    const reportsButton = page.getByRole('button', { name: /relatórios/i });
    if (await reportsButton.isVisible()) {
      await reportsButton.click();
      await page.waitForTimeout(500); // Wait for animation
    }
    
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'dashboard-reports-expanded',
      fullPage: true,
    });
  });

  test('should match baseline - dark mode', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    
    // Enable dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'dashboard-dark-mode',
      fullPage: true,
    });
  });

  test('should match baseline - with create transaction modal', async ({ page }) => {
    await page.goto('/dashboard');
    await waitForPageLoad(page);
    
    // Click "Novo Lançamento" button
    const createButton = page.getByRole('button', { name: /novo lançamento/i });
    await createButton.click();
    
    // Wait for modal to appear
    await page.waitForSelector('[role="dialog"]', { state: 'visible' });
    await page.waitForTimeout(500);
    
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'dashboard-create-transaction-modal',
      fullPage: true,
    });
  });
});
