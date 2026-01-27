import { test } from '@playwright/test';
import { setupAuth, waitForPageLoad } from './utils/auth';
import { preparePageForVisualTest, takeVisualSnapshot } from './utils/visual';

/**
 * Visual regression tests for Reports pages
 * (Performance Report and Expense Analysis Report)
 */

test.describe('Performance Report Page - Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page);
  });

  test('should match baseline - default state', async ({ page }) => {
    await page.goto('/reports/performance');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'performance-report-default',
      fullPage: true,
    });
  });

  test('should match baseline - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/reports/performance');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'performance-report-mobile',
      fullPage: true,
    });
  });

  test('should match baseline - tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/reports/performance');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'performance-report-tablet',
      fullPage: true,
    });
  });

  test('should match baseline - dark mode', async ({ page }) => {
    await page.goto('/reports/performance');
    await waitForPageLoad(page);
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'performance-report-dark-mode',
      fullPage: true,
    });
  });
});

test.describe('Expense Analysis Report Page - Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page);
  });

  test('should match baseline - default state', async ({ page }) => {
    await page.goto('/reports/expense-analysis');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'expense-analysis-default',
      fullPage: true,
    });
  });

  test('should match baseline - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/reports/expense-analysis');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'expense-analysis-mobile',
      fullPage: true,
    });
  });

  test('should match baseline - tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/reports/expense-analysis');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'expense-analysis-tablet',
      fullPage: true,
    });
  });

  test('should match baseline - dark mode', async ({ page }) => {
    await page.goto('/reports/expense-analysis');
    await waitForPageLoad(page);
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'expense-analysis-dark-mode',
      fullPage: true,
    });
  });
});
