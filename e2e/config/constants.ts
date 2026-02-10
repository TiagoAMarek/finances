/**
 * Centralized configuration constants for visual regression tests
 * Single source of truth for all test configuration values
 */

/**
 * Fixed date for visual regression tests to ensure consistent screenshots
 * Set to January 25, 2024 to match the mock transaction data
 * This date is used with Playwright's clock API to mock Date.now() and new Date()
 */
export const FIXED_DATE = new Date('2024-01-25T12:00:00.000Z');

/**
 * Standard viewport sizes for responsive testing
 */
export const VIEWPORTS = {
  MOBILE: { width: 375, height: 667 },
  TABLET: { width: 768, height: 1024 },
  DESKTOP: { width: 1920, height: 1080 },
  DESKTOP_SMALL: { width: 1280, height: 720 },
} as const;

/**
 * Wait time constants
 * @deprecated Most waits should use smart-wait utilities instead
 */
export const WAIT_TIMES = {
  /** @deprecated Use waitForChartsToRender instead */
  CHART_RENDER: 1000,
  /** @deprecated Use smartWait instead */
  ANIMATION: 300,
  /** @deprecated Use smartWait instead */
  STANDARD: 100,
  /** Timeout for modal to appear */
  MODAL_APPEAR: 5000,
  /** Network idle timeout */
  NETWORK_IDLE: 5000,
} as const;

/**
 * Screenshot comparison tolerance levels
 * Use STRICT for critical UI, NORMAL for general pages, RELAXED for dynamic content
 */
export const SNAPSHOT_TOLERANCES = {
  STRICT: {
    maxDiffPixelRatio: 0.01,
    maxDiffPixels: 10,
    threshold: 0.1,
  },
  NORMAL: {
    maxDiffPixelRatio: 0.1,
    maxDiffPixels: 100,
    threshold: 0.2,
  },
  RELAXED: {
    maxDiffPixelRatio: 0.2,
    maxDiffPixels: 500,
    threshold: 0.3,
  },
} as const;

/**
 * Test tags for selective test execution
 */
export const TEST_TAGS = {
  CRITICAL: '@critical',
  SMOKE: '@smoke',
  MOBILE: '@mobile',
  DESKTOP: '@desktop',
  TABLET: '@tablet',
  SLOW: '@slow',
  CHARTS: '@charts',
} as const;

/**
 * Common selectors used across tests
 */
export const SELECTORS = {
  // Modals and dialogs
  DIALOG: '[role="dialog"]',
  MODAL_BACKDROP: '[data-state="open"]',
  
  // Charts
  RECHARTS_WRAPPER: '.recharts-wrapper',
  RECHARTS_SURFACE: '.recharts-surface',
  
  // Loading states
  LOADING_SPINNER: '[data-testid="loading-spinner"]',
  
  // Buttons
  CREATE_TRANSACTION_BTN: 'button:has-text("Novo Lançamento")',
  SUBMIT_BTN: 'button[type="submit"]',
  
  // Forms
  EMAIL_INPUT: 'input[type="email"]',
  PASSWORD_INPUT: 'input[type="password"]',
  
  // Navigation
  RESOURCES_ACCORDION: 'button[name*="recursos" i]',
  EXPENSE_TAB: '[role="tab"]:has-text("Despesa")',
} as const;

/**
 * Test data for authentication
 */
export const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
} as const;

/**
 * Page routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  ACCOUNTS: '/accounts',
  CREDIT_CARDS: '/credit_cards',
  CATEGORIES: '/categories',
  PERFORMANCE_REPORT: '/reports/performance',
  EXPENSE_ANALYSIS: '/reports/expense-analysis',
} as const;

/**
 * Snapshot naming conventions
 */
export const SNAPSHOT_PREFIX = {
  LOGIN: 'login-page',
  REGISTER: 'register-page',
  DASHBOARD: 'dashboard',
  ACCOUNTS: 'accounts',
  CREDIT_CARDS: 'credit-cards',
  TRANSACTIONS: 'transactions',
  CATEGORIES: 'categories',
  PERFORMANCE_REPORT: 'performance-report',
  EXPENSE_ANALYSIS: 'expense-analysis',
} as const;

/**
 * Theme modes
 */
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
} as const;

/**
 * Color scheme values for emulation
 */
export const COLOR_SCHEME = {
  LIGHT: 'light' as const,
  DARK: 'dark' as const,
  NO_PREFERENCE: 'no-preference' as const,
};
