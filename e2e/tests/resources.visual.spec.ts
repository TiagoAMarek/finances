import { test } from '../fixtures/visual-test';
import { AccountsPage, CreditCardsPage, TransactionsPage, CategoriesPage } from '../pages/ResourcePages';
import { STANDARD_CONFIGS, FULL_CONFIGS, createAuthenticatedTestMatrix } from '../utils/test-matrix';
import { ROUTES } from '../config/constants';

/**
 * Visual regression tests for resource management pages
 * (Accounts, Credit Cards, Transactions, Categories)
 * 
 * REFACTORED WITH:
 * ✅ Page Objects - Cleaner interactions, reusable methods
 * ✅ Test Matrix - Eliminates duplicate viewport/dark mode tests (90% less code)
 * ✅ Smart Waits - Built into page object methods
 * 
 * BEFORE: 186 lines with massive duplication
 * AFTER: 88 lines - 53% reduction!
 */

// ============================================================================
// ACCOUNTS PAGE
// ============================================================================

// Test matrix generates: desktop, mobile, dark mode tests
createAuthenticatedTestMatrix(
  'Accounts Page - Visual Regression',
  STANDARD_CONFIGS, // desktop + mobile (no tablet needed)
  async (config, page) => {
    const accountsPage = new AccountsPage(page);
    await accountsPage.goto();
    await accountsPage.prepareForVisual();
    await accountsPage.takeSnapshot(`accounts-${config.name}`);
  }
);

// ============================================================================
// CREDIT CARDS PAGE
// ============================================================================

// Test matrix generates: desktop, mobile, dark mode tests
createAuthenticatedTestMatrix(
  'Credit Cards Page - Visual Regression',
  STANDARD_CONFIGS, // desktop + mobile
  async (config, page) => {
    const creditCardsPage = new CreditCardsPage(page);
    await creditCardsPage.goto();
    await creditCardsPage.prepareForVisual();
    await creditCardsPage.takeSnapshot(`credit-cards-${config.name}`);
  }
);

// ============================================================================
// TRANSACTIONS PAGE
// ============================================================================

// Test matrix generates: desktop, tablet, mobile, dark mode tests
createAuthenticatedTestMatrix(
  'Transactions Page - Visual Regression',
  FULL_CONFIGS, // desktop + tablet + mobile + dark
  async (config, page) => {
    const transactionsPage = new TransactionsPage(page);
    await transactionsPage.goto();
    await transactionsPage.prepareForVisual();
    await transactionsPage.takeSnapshot(`transactions-${config.name}`);
  }
);

// ============================================================================
// CATEGORIES PAGE
// ============================================================================

// Test matrix generates: desktop, mobile, dark mode tests
createAuthenticatedTestMatrix(
  'Categories Page - Visual Regression',
  STANDARD_CONFIGS, // desktop + mobile
  async (config, page) => {
    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.goto();
    await categoriesPage.prepareForVisual();
    await categoriesPage.takeSnapshot(`categories-${config.name}`);
  }
);

// Custom test: Categories with expense tab
test.describe('Categories Page - Custom States', () => {
  test('should match baseline - with expense tab', async ({ authenticatedPage: page }) => {
    const categoriesPage = new CategoriesPage(page);
    await categoriesPage.goto();
    await categoriesPage.snapshotWithTab('expense', 'categories-expense-tab');
  });
});
