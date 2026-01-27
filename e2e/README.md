# Visual Regression Testing with Playwright

This directory contains visual regression tests for the finance management application. These tests capture screenshots of pages in various states and compare them against baseline images to detect unintended visual changes.

## 📁 Directory Structure

```
e2e/
├── __snapshots__/          # Baseline screenshots for comparison
├── utils/                   # Shared utilities for tests
│   ├── auth.ts             # Authentication helpers
│   └── visual.ts           # Visual testing utilities
├── auth-pages.spec.ts      # Login and Register page tests
├── dashboard.spec.ts       # Dashboard page tests
├── resources.spec.ts       # Accounts, Cards, Transactions, Categories tests
└── reports.spec.ts         # Reports pages tests
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
npx playwright test e2e/auth-pages.spec.ts

# Run only dashboard tests
npx playwright test e2e/dashboard.spec.ts

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
npx playwright test e2e/dashboard.spec.ts --update-snapshots

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
- 📱 **Tablet viewport** (768x1024 and iPad Pro)
- 💻 **Desktop viewport** (1920x1080)
- 🌙 **Dark mode** (all major pages)
- ⚠️ **Error states** (validation errors on forms)
- 📝 **Filled forms** (forms with data entered)
- 🎨 **Interactive states** (modals, accordions expanded)

### Browsers Tested
- Chrome/Chromium (desktop)
- Firefox (desktop)
- Safari/WebKit (desktop)
- Chrome Mobile (Pixel 5)
- Safari Mobile (iPhone 13)
- Tablet (iPad Pro)

## 🛠️ Utilities

### Authentication Helpers (`utils/auth.ts`)

```typescript
import { setupAuth, login, logout } from './utils/auth';

// Fast authentication (sets localStorage directly)
await setupAuth(page);

// Full login flow (fills form and submits)
await login(page);

// Logout
await logout(page);
```

### Visual Testing Helpers (`utils/visual.ts`)

```typescript
import { 
  preparePageForVisualTest, 
  takeVisualSnapshot,
  commonHideSelectors,
  commonMaskSelectors 
} from './utils/visual';

// Prepare page for consistent screenshots
await preparePageForVisualTest(page);

// Take a visual snapshot with options
await takeVisualSnapshot(page, {
  name: 'my-test-screenshot',
  fullPage: true,
  hideSelectors: ['[data-testid="spinner"]'],
  maskSelectors: ['time[datetime]'],
  waitMs: 500,
});
```

## 🎨 Best Practices

### When Writing New Tests

1. **Use `preparePageForVisualTest()`**: Always call this before taking screenshots to ensure:
   - Network is idle
   - Images are loaded
   - Fonts are loaded
   - Scrollbars are hidden
   - Animations complete

2. **Hide or Mask Dynamic Content**:
   ```typescript
   await takeVisualSnapshot(page, {
     name: 'my-test',
     hideSelectors: ['.loading-spinner'],
     maskSelectors: ['time', '[data-id]'],
   });
   ```

3. **Test Multiple Viewports**: Include mobile, tablet, and desktop views for responsive pages

4. **Test Dark Mode**: Add dark mode tests for all user-facing pages

5. **Use Descriptive Names**: Screenshot names should clearly indicate what they test

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

- `maxDiffPixelRatio`: Maximum acceptable pixel difference (default: 0.1)
- `threshold`: Pixel comparison sensitivity (default: 0.2)
- `maxDiffPixels`: Maximum different pixels allowed (default: 100)

Adjust these values if tests are too strict or too lenient.

## 🚨 Troubleshooting

### Flaky Tests

If tests fail inconsistently:

1. Increase wait times in `preparePageForVisualTest()`
2. Add explicit waits for specific elements
3. Mask or hide dynamic content causing issues

### Platform Differences

Screenshots may vary slightly between:
- Operating systems (Linux, macOS, Windows)
- CI environment vs local

**Solution**: Generate baselines in CI or use Docker for consistency

### Font Rendering

Font rendering can differ across platforms.

**Solution**: 
- Use web fonts (not system fonts)
- Ensure fonts are fully loaded before screenshots
- Consider using `--project=chromium-desktop` for most tests

## 📊 CI Integration

Visual tests run in CI with:
- Headless browser mode
- Retries for flaky tests
- Automatic screenshot comparison
- HTML report generation

See `.github/workflows/visual-tests.yml` for CI configuration.

## 🔗 Related Documentation

- [Playwright Documentation](https://playwright.dev)
- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots)
- [Project Testing Guide](../README.md#testing)

## 📝 Adding New Tests

To add visual tests for a new page:

1. Create a new spec file: `e2e/my-page.spec.ts`
2. Import utilities:
   ```typescript
   import { setupAuth } from './utils/auth';
   import { preparePageForVisualTest, takeVisualSnapshot } from './utils/visual';
   ```
3. Write tests following existing patterns
4. Generate initial baselines:
   ```bash
   npx playwright test e2e/my-page.spec.ts --update-snapshots
   ```
5. Review baselines in `e2e/__snapshots__/`
6. Commit baselines to version control

## 📈 Maintenance

- **Review baselines periodically** to ensure they're still relevant
- **Update baselines** after intentional design changes
- **Prune unused snapshots** when removing tests
- **Keep tests fast** by testing critical paths first

## ⚡ Performance Tips

- Use `--project=chromium-desktop` for faster local development
- Run full suite (all browsers) before merging PRs
- Parallelize test execution with `--workers` flag
- Use `--grep` to run specific tests during development

---

For questions or issues with visual regression tests, please open an issue or contact the development team.
