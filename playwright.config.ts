import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';

/**
 * Standalone Playwright configuration for visual regression testing.
 * 
 * This configuration is separate from the Vitest browser tests and focuses
 * on visual regression testing of pages using Playwright's screenshot comparison.
 * 
 * Run tests with:
 * - `pnpm test:visual` - Run visual regression tests
 * - `pnpm test:visual:update` - Update baseline screenshots
 * - `pnpm test:visual:report` - Show visual diff report
 */
export default defineConfig({
  testDir: './e2e',
  
  // Folder for test artifacts such as screenshots, videos, traces, etc.
  outputDir: './test-results',
  
  // Folder for snapshots (baseline screenshots)
  snapshotDir: './e2e/__snapshots__',
  
  // Maximum time one test can run for
  timeout: 30 * 1000,
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html', { outputFolder: './playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: './test-results/results.json' }],
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
    // Desktop browsers
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'firefox-desktop',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'webkit-desktop',
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    
    // Tablet viewports
    {
      name: 'tablet',
      use: { 
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 },
      },
    },
    
    // Mobile browsers
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 13'],
      },
    },
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
    },
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
    },
  },
});
