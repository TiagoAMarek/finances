import { test } from '@playwright/test';
import { setupAuth, waitForPageLoad } from './utils/auth';
import { preparePageForVisualTest, takeVisualSnapshot } from './utils/visual';

/**
 * Visual regression tests for resource management pages
 * (Accounts, Credit Cards, Transactions, Categories)
 */

test.describe('Accounts Page - Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page);
  });

  test('should match baseline - default state', async ({ page }) => {
    await page.goto('/accounts');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'accounts-default',
      fullPage: true,
    });
  });

  test('should match baseline - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/accounts');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'accounts-mobile',
      fullPage: true,
    });
  });

  test('should match baseline - dark mode', async ({ page }) => {
    await page.goto('/accounts');
    await waitForPageLoad(page);
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'accounts-dark-mode',
      fullPage: true,
    });
  });
});

test.describe('Credit Cards Page - Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page);
  });

  test('should match baseline - default state', async ({ page }) => {
    await page.goto('/credit_cards');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'credit-cards-default',
      fullPage: true,
    });
  });

  test('should match baseline - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/credit_cards');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'credit-cards-mobile',
      fullPage: true,
    });
  });

  test('should match baseline - dark mode', async ({ page }) => {
    await page.goto('/credit_cards');
    await waitForPageLoad(page);
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'credit-cards-dark-mode',
      fullPage: true,
    });
  });
});

test.describe('Transactions Page - Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page);
  });

  test('should match baseline - default state', async ({ page }) => {
    await page.goto('/transactions');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'transactions-default',
      fullPage: true,
    });
  });

  test('should match baseline - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/transactions');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'transactions-mobile',
      fullPage: true,
    });
  });

  test('should match baseline - tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/transactions');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'transactions-tablet',
      fullPage: true,
    });
  });

  test('should match baseline - dark mode', async ({ page }) => {
    await page.goto('/transactions');
    await waitForPageLoad(page);
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'transactions-dark-mode',
      fullPage: true,
    });
  });
});

test.describe('Categories Page - Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page);
  });

  test('should match baseline - default state', async ({ page }) => {
    await page.goto('/categories');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'categories-default',
      fullPage: true,
    });
  });

  test('should match baseline - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/categories');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'categories-mobile',
      fullPage: true,
    });
  });

  test('should match baseline - dark mode', async ({ page }) => {
    await page.goto('/categories');
    await waitForPageLoad(page);
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });
    
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'categories-dark-mode',
      fullPage: true,
    });
  });

  test('should match baseline - with tabs', async ({ page }) => {
    await page.goto('/categories');
    await waitForPageLoad(page);
    
    // Click on expense tab
    const expenseTab = page.getByRole('tab', { name: /despesa/i });
    if (await expenseTab.isVisible()) {
      await expenseTab.click();
      await page.waitForTimeout(300);
    }
    
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'categories-expense-tab',
      fullPage: true,
    });
  });
});
