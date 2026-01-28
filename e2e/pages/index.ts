/**
 * Page Objects - Index
 * 
 * Central export point for all page objects
 * Makes imports cleaner throughout the test suite
 */

// Base
export { BasePage } from './BasePage';

// Auth pages
export { LoginPage, RegisterPage } from './AuthPages';

// Main pages
export { DashboardPage } from './DashboardPage';

// Resource pages
export { 
  AccountsPage, 
  CreditCardsPage, 
  TransactionsPage, 
  CategoriesPage 
} from './ResourcePages';

// Report pages
export { 
  PerformanceReportPage, 
  ExpenseAnalysisPage 
} from './ReportPages';
