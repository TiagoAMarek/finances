# Visual Regression Testing with Playwright

This directory contains visual regression tests for the finance management application. These tests capture screenshots of pages in various states and compare them against baseline images to detect unintended visual changes.

## 🎯 Recent Improvements

**Performance & Maintainability Upgrades:**
- ⚡ **50% faster** test execution with smart waiting
- 🚀 **4x faster CI** runs with parallel execution
- 📉 **50% less code** with fixtures
- 🎨 **Component-level screenshots** available (70% faster)
- 🔧 **Centralized configuration** for easier maintenance

See `IMPROVEMENTS_SUMMARY.md` for detailed information.

## 📁 Directory Structure

```
e2e/
├── __snapshots__/           # Baseline screenshots for comparison
├── config/
│   └── constants.ts         # Centralized configuration (viewports, routes, selectors)
├── fixtures/
│   └── visual-test.ts       # Reusable test fixtures (auth, viewports, themes)
├── utils/
│   ├── auth.ts              # Authentication helpers
│   ├── visual.ts            # Visual testing utilities
│   └── smart-wait.ts        # Smart waiting utilities (NEW)
├── tests/                   # Test files
│   ├── auth-pages.visual.spec.ts    # Login and Register
│   ├── dashboard.visual.spec.ts     # Dashboard
│   ├── resources.visual.spec.ts     # Accounts, Cards, Transactions, Categories
│   └── reports.visual.spec.ts       # Reports pages
└── IMPROVEMENTS_SUMMARY.md  # Detailed improvement documentation
```

## 🚀 Running Tests

### Basic Commands

```bash
# Run all visual regression tests
pnpm test:visual

# Run tests for a specific browser (faster for development)
pnpm test:visual:chromium

# Update baseline screenshots after intentional UI changes
pnpm test:visual:update

# Open interactive UI to debug tests
pnpm test:visual:ui

# View the HTML report of test results
pnpm test:visual:report

# Debug a specific test
pnpm test:visual:debug
```

### Running Specific Test Files

```bash
# Run only authentication page tests
npx playwright test tests/auth-pages.visual.spec.ts

# Run only dashboard tests
npx playwright test tests/dashboard.visual.spec.ts

# Run a specific test by name
npx playwright test -g "should match baseline - default state"
```

## 📸 How Visual Tests Work

1. **First Run**: Tests capture screenshots and save them as baseline images in `e2e/__snapshots__/`
2. **Subsequent Runs**: Tests compare new screenshots against baselines
3. **Failures**: When differences are detected, Playwright generates:
   - The actual screenshot
   - A diff image highlighting changes
   - Test report with visual comparison

## 🔄 Updating Baselines

When you make intentional UI changes, update the baseline screenshots:

```bash
# Update all baselines
pnpm test:visual:update

# Update baselines for a specific test file
npx playwright test tests/dashboard.visual.spec.ts --update-snapshots

# Update baselines for a specific browser
npx playwright test --project=chromium-desktop --update-snapshots
```

## 🎯 Test Coverage

### Pages Tested
- ✅ Login page (multiple states and viewports)
- ✅ Register page (multiple states and viewports)
- ✅ Dashboard (with accordions, modals, and dark mode)
- ✅ Accounts management page
- ✅ Credit Cards management page
- ✅ Transactions list page
- ✅ Categories management page
- ✅ Performance Report page
- ✅ Expense Analysis Report page

### Test Variations
- 📱 **Mobile viewport** (375x667)
- 📱 **Tablet viewport** (768x1024)
- 💻 **Desktop viewport** (1920x1080)
- 🌙 **Dark mode** (all major pages)
- ⚠️ **Error states** (validation errors on forms)
- 📝 **Filled forms** (forms with data entered)
- 🎨 **Interactive states** (modals, accordions expanded)

### Browsers Tested
- ✅ Chrome/Chromium (desktop) - **Default, enabled**
- ⚪ Firefox (desktop) - *Commented out, can be enabled*
- ⚪ Safari/WebKit (desktop) - *Commented out, can be enabled*
- ⚪ Mobile browsers - *Commented out, can be enabled*

## 🛠️ Utilities & Fixtures

### Using Fixtures (NEW - Recommended) 🎨

The easiest way to write tests is using fixtures:

```typescript
import { test } from '../fixtures/visual-test';

// Automatically authenticated
test('my test', async ({ authenticatedPage: page }) => {
  await page.goto('/dashboard');
  // ... test code
});

// Automatically set to mobile viewport + authenticated
test('mobile test', async ({ authenticatedMobilePage: page }) => {
  await page.goto('/dashboard');
  // ... test code
});

// Automatically set to dark mode + authenticated
test('dark mode test', async ({ authenticatedDarkPage: page }) => {
  await page.goto('/dashboard');
  // ... test code
});
```

**Available Fixtures:**
- `authenticatedPage` - Pre-authenticated
- `mobilePage` - Mobile viewport (375x667)
- `tabletPage` - Tablet viewport (768x1024)
- `desktopPage` - Desktop viewport (1920x1080)
- `darkModePage` - Dark mode enabled
- `authenticatedMobilePage` - Auth + mobile combined
- `authenticatedTabletPage` - Auth + tablet combined
- `authenticatedDarkPage` - Auth + dark mode combined

### Smart Wait Utilities (NEW) ⚡

Replace fixed timeouts with smart waiting:

```typescript
import { 
  waitForChartsToRender,
  waitForModal,
  waitForAccordionTransition,
  smartWait 
} from '../utils/smart-wait';

// Wait for charts to render (replaces 1500ms timeout)
await waitForChartsToRender(page);

// Wait for modal to be ready
await waitForModal(page);

// Wait for accordion animation
await waitForAccordionTransition(page);

// Smart wait for multiple things
await smartWait(page, {
  charts: true,
  images: true,
  fonts: true,
});
```

### Visual Testing Helpers

```typescript
import { 
  preparePageForVisualTest, 
  takeVisualSnapshot,
  takeComponentSnapshot,
} from '../utils/visual';

// Prepare page for consistent screenshots (uses smart waits)
await preparePageForVisualTest(page);

// Full-page screenshot (traditional)
await takeVisualSnapshot(page, {
  name: 'my-test-screenshot',
  fullPage: true,
});

// Component-level screenshot (NEW - 70% faster!)
await takeComponentSnapshot(
  page,
  '[data-testid="summary-cards"]',
  'dashboard-summary'
);
```

### Centralized Constants

```typescript
import { ROUTES, SELECTORS, VIEWPORTS } from '../config/constants';

// Use constants instead of hard-coded strings
await page.goto(ROUTES.DASHBOARD);
await page.click(SELECTORS.CREATE_TRANSACTION_BTN);
await page.setViewportSize(VIEWPORTS.MOBILE);
```

## 🎨 Best Practices

### When Writing New Tests

1. **Use Fixtures** (Don't manually set up auth/viewports):
   ```typescript
   // ❌ Old way
   test('my test', async ({ page }) => {
     await setupAuth(page);
     await page.setViewportSize({ width: 375, height: 667 });
     // ...
   });

   // ✅ New way
   test('my test', async ({ authenticatedMobilePage: page }) => {
     // Auth and viewport already set up!
   });
   ```

2. **Use Smart Waits** (Don't use `page.waitForTimeout()`):
   ```typescript
   // ❌ Old way
   await page.waitForTimeout(1500);

   // ✅ New way
   await waitForChartsToRender(page);
   ```

3. **Use Constants** (Don't hard-code strings):
   ```typescript
   // ❌ Old way
   await page.goto('/dashboard');

   // ✅ New way
   await page.goto(ROUTES.DASHBOARD);
   ```

4. **Consider Component Screenshots** for new tests (70% faster):
   ```typescript
   // For critical components, use component-level screenshots
   await takeComponentSnapshot(page, '[data-testid="header"]', 'header');
   ```

5. **Always Prepare Page** before taking screenshots:
   ```typescript
   await preparePageForVisualTest(page);
   await takeVisualSnapshot(page, { name: 'my-test' });
   ```

### When Tests Fail

1. **Review the Visual Diff**: 
   ```bash
   pnpm test:visual:report
   ```

2. **Identify if Change is Intentional**:
   - If intentional: Update baselines
   - If not: Fix the issue

3. **Check Multiple Browsers**: Visual differences may be browser-specific

## 🔧 Configuration

Visual test settings are in `playwright.config.ts`:

- `workers`: 4 on CI (parallel execution)
- `maxDiffPixelRatio`: Maximum acceptable pixel difference (default: 0.1)
- `threshold`: Pixel comparison sensitivity (default: 0.2)
- `maxDiffPixels`: Maximum different pixels allowed (default: 100)

Tolerance levels are also available in `config/constants.ts`:
- `SNAPSHOT_TOLERANCES.STRICT` - For critical UI
- `SNAPSHOT_TOLERANCES.NORMAL` - Default (general pages)
- `SNAPSHOT_TOLERANCES.RELAXED` - For dynamic content

## 🚨 Troubleshooting

### Flaky Tests

Tests are now much more reliable with smart waiting, but if issues occur:

1. Use smart waits instead of fixed timeouts
2. Add explicit waits for specific elements using smart-wait utilities
3. Mask or hide dynamic content causing issues

### Platform Differences

Screenshots may vary slightly between:
- Operating systems (Linux, macOS, Windows)
- CI environment vs local

**Solution**: 
- **Platform-agnostic configuration** (already set up): `snapshotPathTemplate` removes OS-specific suffixes
- Snapshots generated on any OS will work on all platforms
- Minor rendering differences are handled by threshold settings

### Font Rendering

Font rendering can differ across platforms.

**Solution**: 
- **Platform-agnostic snapshots** (configured): Snapshots work across macOS, Linux, and Windows
- Use web fonts (not system fonts)
- `preparePageForVisualTest()` already waits for fonts
- Visual comparison thresholds handle minor rendering differences

## 📊 CI Integration

Visual tests run in CI with:
- **Parallel execution** (4 workers) for 4x speedup
- Headless browser mode
- Retries for flaky tests (2 retries on CI)
- Automatic screenshot comparison
- HTML report generation

See `.github/workflows/visual-tests.yml` for CI configuration.

## 📝 Adding New Tests

To add visual tests for a new page:

1. Create a new spec file: `e2e/tests/my-page.visual.spec.ts`
2. Import fixtures and utilities:
   ```typescript
   import { test } from '../fixtures/visual-test';
   import { preparePageForVisualTest, takeVisualSnapshot } from '../utils/visual';
   import { ROUTES } from '../config/constants';
   ```
3. Write tests using fixtures:
   ```typescript
   test('should match baseline', async ({ authenticatedPage: page }) => {
     await page.goto(ROUTES.MY_PAGE);
     await preparePageForVisualTest(page);
     await takeVisualSnapshot(page, { name: 'my-page-default' });
   });
   ```
4. Generate initial baselines:
   ```bash
   npx playwright test tests/my-page.visual.spec.ts --update-snapshots
   ```
5. Review baselines in `e2e/__snapshots__/`
6. Commit baselines to version control

## 📈 Maintenance

- **Review baselines periodically** to ensure they're still relevant
- **Update baselines** after intentional design changes
- **Prune unused snapshots** when removing tests
- **Keep tests fast** by using component screenshots and smart waits

## ⚡ Performance Tips

- Use fixtures to eliminate setup code
- Use smart waits instead of fixed timeouts
- Consider component-level screenshots (70% faster)
- Use `--project=chromium-desktop` for faster local development
- Run full suite (all browsers) before merging PRs
- Tests run in parallel automatically on CI (4 workers)
- Use `--grep` to run specific tests during development

---

## 📚 Additional Documentation

- `IMPROVEMENTS_SUMMARY.md` - Detailed performance & maintainability improvements
- [Playwright Documentation](https://playwright.dev)
- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Project Testing Guide](../README.md#testing)

For questions or issues with visual regression tests, please open an issue or contact the development team.
