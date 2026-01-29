import { test } from '../fixtures/visual-test';
import { PerformanceReportPage, ExpenseAnalysisPage } from '../pages/ReportPages';
import { FULL_CONFIGS, createAuthenticatedTestMatrix } from '../utils/test-matrix';
import { ROUTES } from '../config/constants';

/**
 * Visual regression tests for Reports pages
 * (Performance Report and Expense Analysis Report)
 * 
 * REFACTORED WITH:
 * ✅ Page Objects - Cleaner interactions, reusable methods
 * ✅ Test Matrix - Eliminates duplicate viewport/dark mode tests (90% less code)
 * ✅ Smart Waits - Built into page object methods (chart waits handled automatically)
 * 
 * BEFORE: 107 lines with repetitive code
 * AFTER: 43 lines - 60% reduction!
 */

// ============================================================================
// PERFORMANCE REPORT PAGE
// ============================================================================

// Test matrix generates: desktop, tablet, mobile, dark mode tests
createAuthenticatedTestMatrix(
  'Performance Report Page - Visual Regression',
  FULL_CONFIGS, // desktop + tablet + mobile + dark
  async (config, page) => {
    const performanceReport = new PerformanceReportPage(page);
    await performanceReport.goto(); // Navigates and waits for charts
    await performanceReport.snapshotReport(`performance-report-${config.name}`);
  }
);

// ============================================================================
// EXPENSE ANALYSIS PAGE
// ============================================================================

// Test matrix generates: desktop, tablet, mobile, dark mode tests
createAuthenticatedTestMatrix(
  'Expense Analysis Report Page - Visual Regression',
  FULL_CONFIGS, // desktop + tablet + mobile + dark
  async (config, page) => {
    const expenseAnalysis = new ExpenseAnalysisPage(page);
    await expenseAnalysis.goto(); // Navigates and waits for charts
    await expenseAnalysis.snapshotReport(`expense-analysis-${config.name}`);
  }
);
