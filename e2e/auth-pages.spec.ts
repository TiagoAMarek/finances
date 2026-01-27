import { test } from '@playwright/test';
import { preparePageForVisualTest, takeVisualSnapshot } from './utils/visual';

/**
 * Visual regression tests for authentication pages (login and register)
 * 
 * These tests capture screenshots of the login and register pages
 * in different states and viewports for visual regression testing.
 */

test.describe('Authentication Pages - Visual Regression', () => {
  test.describe('Login Page', () => {
    test('should match baseline - default state', async ({ page }) => {
      await page.goto('/login');
      await preparePageForVisualTest(page);
      
      await takeVisualSnapshot(page, {
        name: 'login-page-default',
      });
    });

    test('should match baseline - with validation errors', async ({ page }) => {
      await page.goto('/login');
      await preparePageForVisualTest(page);
      
      // Submit form without filling to trigger validation
      await page.click('button[type="submit"]');
      
      // Wait for validation errors to appear
      await page.waitForTimeout(500);
      
      await takeVisualSnapshot(page, {
        name: 'login-page-validation-errors',
      });
    });

    test('should match baseline - mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/login');
      await preparePageForVisualTest(page);
      
      await takeVisualSnapshot(page, {
        name: 'login-page-mobile',
      });
    });

    test('should match baseline - tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto('/login');
      await preparePageForVisualTest(page);
      
      await takeVisualSnapshot(page, {
        name: 'login-page-tablet',
      });
    });

    test('should match baseline - with filled form', async ({ page }) => {
      await page.goto('/login');
      await preparePageForVisualTest(page);
      
      // Fill in the form
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      
      await takeVisualSnapshot(page, {
        name: 'login-page-filled-form',
      });
    });

    test('should match baseline - dark mode', async ({ page }) => {
      await page.goto('/login');
      
      // Enable dark mode by adding class to html element
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
      });
      
      await preparePageForVisualTest(page);
      
      await takeVisualSnapshot(page, {
        name: 'login-page-dark-mode',
      });
    });
  });

  test.describe('Register Page', () => {
    test('should match baseline - default state', async ({ page }) => {
      await page.goto('/register');
      await preparePageForVisualTest(page);
      
      await takeVisualSnapshot(page, {
        name: 'register-page-default',
      });
    });

    test('should match baseline - with validation errors', async ({ page }) => {
      await page.goto('/register');
      await preparePageForVisualTest(page);
      
      // Submit form without filling to trigger validation
      await page.click('button[type="submit"]');
      
      // Wait for validation errors to appear
      await page.waitForTimeout(500);
      
      await takeVisualSnapshot(page, {
        name: 'register-page-validation-errors',
      });
    });

    test('should match baseline - mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto('/register');
      await preparePageForVisualTest(page);
      
      await takeVisualSnapshot(page, {
        name: 'register-page-mobile',
      });
    });

    test('should match baseline - tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto('/register');
      await preparePageForVisualTest(page);
      
      await takeVisualSnapshot(page, {
        name: 'register-page-tablet',
      });
    });

    test('should match baseline - with filled form', async ({ page }) => {
      await page.goto('/register');
      await preparePageForVisualTest(page);
      
      // Fill in the form
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      
      await takeVisualSnapshot(page, {
        name: 'register-page-filled-form',
      });
    });

    test('should match baseline - dark mode', async ({ page }) => {
      await page.goto('/register');
      
      // Enable dark mode by adding class to html element
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
      });
      
      await preparePageForVisualTest(page);
      
      await takeVisualSnapshot(page, {
        name: 'register-page-dark-mode',
      });
    });
  });
});
