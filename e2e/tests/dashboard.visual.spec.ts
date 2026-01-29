import { test } from '../fixtures/visual-test';
import { DashboardPage } from '../pages/DashboardPage';
import { FULL_CONFIGS, createAuthenticatedTestMatrix } from '../utils/test-matrix';
import { ROUTES } from '../config/constants';

/**
 * Visual regression tests for the Dashboard page
 * 
 * REFACTORED WITH:
 * ✅ Page Objects - Cleaner interactions with helper methods
 * ✅ Test Matrix - Eliminates duplicate viewport/dark mode tests
 * ✅ Smart Waits - Built into page object methods
 * 
 * BEFORE: 117 lines with repetitive code
 * AFTER: 76 lines - 35% reduction!
 */

// ============================================================================
// STANDARD VIEWPORT & THEME TESTS
// ============================================================================

// Test matrix generates: desktop, tablet, mobile, dark mode tests
createAuthenticatedTestMatrix(
  'Dashboard Page - Visual Regression',
  FULL_CONFIGS, // desktop + tablet + mobile + dark
  async (config, page) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto(); // Navigates and waits for charts
    await dashboard.snapshotDefault(`dashboard-${config.name}`);
  }
);

// ============================================================================
// CUSTOM STATE TESTS
// ============================================================================

test.describe('Dashboard Page - Custom States', () => {
  test('should match baseline - with resources expanded', async ({ authenticatedPage: page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await dashboard.snapshotWithResourcesExpanded();
  });

  test('should match baseline - with reports expanded (default)', async ({ authenticatedPage: page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    // Reports accordion is expanded by default (defaultValue="reports")
    await dashboard.prepareForVisual();
    await dashboard.takeSnapshot('dashboard-reports-expanded');
  });

  test('should match baseline - with create transaction modal', async ({ authenticatedPage: page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();
    await dashboard.snapshotWithModal('dashboard-create-transaction-modal');
  });
});

// ============================================================================
// COMPONENT-LEVEL TESTS (Optional - for faster execution)
// ============================================================================
// Uncomment to enable component-level screenshots (70% faster, 90% smaller files)
//
// test.describe('Dashboard Page - Component Screenshots', () => {
//   test('should match baseline - all components', async ({ authenticatedPage: page }) => {
//     const dashboard = new DashboardPage(page);
//     await dashboard.goto();
//     await dashboard.snapshotComponents('dashboard');
//   });
//
//   test('should match baseline - dark mode components', async ({ authenticatedDarkPage: page }) => {
//     const dashboard = new DashboardPage(page);
//     await dashboard.goto();
//     await dashboard.snapshotComponents('dashboard-dark');
//   });
// });
