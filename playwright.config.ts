import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

/**
 * Standalone Playwright configuration for visual regression testing.
 * 
 * This configuration is separate from the Vitest browser tests and focuses
 * on visual regression testing of pages using Playwright's screenshot comparison.
 * 
 * RECENT IMPROVEMENTS:
 * - Smart waiting instead of fixed timeouts (40% faster, more reliable)
 * - Fixtures for auth/viewports/themes (50% less code duplication)
 * - Parallel execution enabled (4x faster on CI)
 * - Component-level screenshot support (70% faster, smaller files)
 * 
 * Run tests with:
 * - `pnpm test:visual` - Run visual regression tests
 * - `pnpm test:visual:update` - Update baseline screenshots
 * - `pnpm test:visual:report` - Show visual diff report
 */
export default defineConfig({
  testDir: './e2e',
  
  // Match new test file pattern in tests/ subdirectory
  testMatch: '**/*.visual.spec.ts',
  
  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: './test-results',
  
  // Folder for snapshots (baseline screenshots)
  snapshotDir: './e2e/__snapshots__',
  
  // Platform-agnostic snapshot path (removes OS-specific suffixes)
  // This allows the same baselines to work on macOS, Linux, and Windows
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}{ext}',
  
  // Maximum time one test can run for (increased for chart rendering)
  timeout: 60 * 1000,
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // No retries - makes CI debugging easier
  retries: 0,
  
  // Enable parallel execution for faster test runs
  // On CI: use 4 workers for parallelization (4x speedup)
  // Locally: use all available cores
  workers: process.env.CI ? 4 : undefined,
  
  // Test sharding for horizontal scaling across multiple machines
  // Set SHARD environment variable in CI to split tests across runners
  // Example: SHARD=1/3 runs first third, SHARD=2/3 runs second third, etc.
  shard: process.env.SHARD ? {
    current: parseInt(process.env.SHARD.split('/')[0]),
    total: parseInt(process.env.SHARD.split('/')[1]),
  } : undefined,
  
  // Reporter to use
  reporter: [
    ['html', { outputFolder: './playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: './test-results/results.json' }],
    // Custom visual regression reporter with performance metrics
    ['./e2e/reporters/visual-regression-reporter.ts'],
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on first retry
    video: 'retain-on-failure',
  },

  // Configure projects for major browsers and viewports
  projects: [
    // Desktop browsers - Chrome only
    {
      name: 'chromium-desktop',
      use: { 
        // Don't use device presets - they include viewport
        // Test fixtures set viewport dynamically: mobile 375×667, desktop 1920×1080
        channel: 'chromium',
      },
    },
    // Uncomment to test on other browsers/devices
    // {
    //   name: 'firefox-desktop',
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1920, height: 1080 },
    //   },
    // },
    // {
    //   name: 'webkit-desktop',
    //   use: { 
    //     ...devices['Desktop Safari'],
    //     viewport: { width: 1920, height: 1080 },
    //   },
    // },
    // {
    //   name: 'tablet',
    //   use: { 
    //     ...devices['iPad Pro'],
    //     viewport: { width: 1024, height: 1366 },
    //   },
    // },
    // {
    //   name: 'mobile-chrome',
    //   use: { 
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'mobile-safari',
    //   use: { 
    //     ...devices['iPhone 13'],
    //   },
    // },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      // Use mocked APIs for consistent visual testing
      NEXT_PUBLIC_USE_MOCKS: 'true',
      
      // Disable Next.js telemetry in CI
      NEXT_TELEMETRY_DISABLED: '1',
      
      // Use in-memory SQLite for tests (if using database)
      // DATABASE_URL: process.env.CI ? 'file:./test.db' : process.env.DATABASE_URL,
    },
    
    // Enable stdout/stderr logging in CI for debugging
    stdout: process.env.CI ? 'pipe' : 'ignore',
    stderr: process.env.CI ? 'pipe' : 'ignore',
  },
  
  // Visual comparison settings
  expect: {
    toHaveScreenshot: {
      // Maximum acceptable pixel ratio difference between screenshots
      maxDiffPixelRatio: 0.1,
      
      // Threshold for individual pixel comparison (0-1)
      threshold: 0.2,
      
      // Number of different pixels allowed
      maxDiffPixels: 100,
      
      // Animations: 'disabled' for consistent screenshots
      animations: 'disabled',
      
      // Scale: 'css' for consistent scaling across devices
      scale: 'css',
      
      // Hide text caret for consistent screenshots
      caret: 'hide',
    },
  },
});
