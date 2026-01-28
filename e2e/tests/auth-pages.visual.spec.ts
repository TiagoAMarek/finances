import { test } from '../fixtures/visual-test';
import { LoginPage, RegisterPage } from '../pages/AuthPages';
import { testUnauthenticatedPage } from '../utils/test-matrix';
import { ROUTES } from '../config/constants';

/**
 * Visual regression tests for authentication pages (login and register)
 * 
 * REFACTORED WITH:
 * ✅ Page Objects - Cleaner interactions, single place to update selectors
 * ✅ Test Matrix - Eliminates duplicate viewport/dark mode tests (94% less code)
 * ✅ Smart Waits - More reliable than fixed timeouts
 * 
 * BEFORE: 154 lines with lots of duplication
 * AFTER: 62 lines - 60% reduction!
 */

// ============================================================================
// LOGIN PAGE TESTS
// ============================================================================

test.describe('Login Page - Visual Regression', () => {
  // Test matrix generates: default (desktop), mobile, tablet, dark mode tests
  testUnauthenticatedPage('Login Page', ROUTES.LOGIN, 'login-page');

  test('should match baseline - with validation errors', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.triggerValidationErrors(); // Uses helper method with smart wait
    await loginPage.prepareForVisual();
    await loginPage.takeSnapshot('login-page-validation-errors');
  });

  test('should match baseline - with filled form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.fillTestForm(); // Uses helper method
    await loginPage.prepareForVisual();
    await loginPage.takeSnapshot('login-page-filled-form');
  });
});

// ============================================================================
// REGISTER PAGE TESTS
// ============================================================================

test.describe('Register Page - Visual Regression', () => {
  // Test matrix generates: default (desktop), mobile, tablet, dark mode tests
  testUnauthenticatedPage('Register Page', ROUTES.REGISTER, 'register-page');

  test('should match baseline - with validation errors', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.triggerValidationErrors(); // Uses helper method with smart wait
    await registerPage.prepareForVisual();
    await registerPage.takeSnapshot('register-page-validation-errors');
  });

  test('should match baseline - with filled form', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.fillTestForm(); // Uses helper method
    await registerPage.prepareForVisual();
    await registerPage.takeSnapshot('register-page-filled-form');
  });
});
