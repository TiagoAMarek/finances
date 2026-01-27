# Visual Regression Testing - Quick Start Guide

This guide provides a quick overview of visual regression testing in this project. For detailed documentation, see [`e2e/README.md`](./e2e/README.md).

## What is Visual Regression Testing?

Visual regression testing automatically captures screenshots of your application and compares them against baseline images to detect unintended visual changes. This helps catch:
- Layout breaks
- CSS regressions
- Responsive design issues
- Dark mode inconsistencies
- Component rendering problems

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Install Playwright Browsers

```bash
pnpm exec playwright install chromium
```

### 3. Generate Baseline Screenshots (First Time Only)

**Option A: Using the automated script (Recommended)**
```bash
./scripts/generate-visual-baselines.sh
```

**Option B: Manual generation**
```bash
pnpm test:visual:update
```

**Option C: Using GitHub Actions**
- Go to Actions → "Generate Visual Regression Baselines"
- Click "Run workflow"
- Select your branch and update mode
- A PR will be created with the baselines

📚 **Detailed guide:** See [`GENERATING_BASELINES.md`](./GENERATING_BASELINES.md)

### 4. Run Visual Tests

```bash
# Run all visual regression tests
pnpm test:visual

# Run tests for a specific browser (faster)
pnpm test:visual:chromium

# Open interactive UI
pnpm test:visual:ui
```

## Common Commands

```bash
# Development workflow
pnpm test:visual:chromium          # Fast local testing
pnpm test:visual:ui                # Interactive debugging

# Update baselines after UI changes
pnpm test:visual:update

# View test results
pnpm test:visual:report

# Debug specific test
pnpm test:visual:debug
```

## Test Coverage

Our visual tests cover:

### Pages
- 🔐 Authentication (Login, Register)
- 📊 Dashboard (with metrics, accordions, modals)
- 💰 Accounts Management
- 💳 Credit Cards Management
- 📝 Transactions List
- 🏷️ Categories Management
- 📈 Performance Report
- 📊 Expense Analysis Report

### Variations
- 📱 Mobile (375x667)
- 📱 Tablet (768x1024, iPad Pro)
- 💻 Desktop (1920x1080)
- 🌙 Dark Mode
- ⚠️ Error States
- 📝 Filled Forms
- 🎨 Interactive States

### Browsers
- Chrome/Chromium
- Firefox
- Safari/WebKit
- Mobile Chrome
- Mobile Safari

## When Tests Fail

1. **View the report**:
   ```bash
   pnpm test:visual:report
   ```

2. **Check if the change is intentional**:
   - ✅ **Yes**: Update baselines with `pnpm test:visual:update`
   - ❌ **No**: Fix the issue in your code

3. **Review the visual diff**: The report shows:
   - Expected (baseline) screenshot
   - Actual (current) screenshot
   - Diff highlighting changes

## CI Integration

Visual tests run automatically on:
- Pull requests to `main` or `develop`
- Pushes to `main`
- Changes to UI code

Results are uploaded as artifacts and failures are reported in PR comments.

## Best Practices

### For Developers

- ✅ Run `pnpm test:visual:chromium` before committing UI changes
- ✅ Update baselines when you intentionally change the UI
- ✅ Review visual diffs carefully in PR
- ✅ Test responsive layouts on multiple viewports
- ✅ Include dark mode tests for new pages

### For Reviewers

- ✅ Check visual test results in CI
- ✅ Review baseline updates in PR
- ✅ Verify changes match design specifications
- ✅ Test visual changes locally if needed

## Adding New Tests

To add visual tests for a new page:

1. Create `e2e/my-page.spec.ts`:

```typescript
import { test } from '@playwright/test';
import { setupAuth, waitForPageLoad } from './utils/auth';
import { preparePageForVisualTest, takeVisualSnapshot } from './utils/visual';

test.describe('My Page - Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page);
  });

  test('should match baseline - default state', async ({ page }) => {
    await page.goto('/my-page');
    await waitForPageLoad(page);
    await preparePageForVisualTest(page);
    
    await takeVisualSnapshot(page, {
      name: 'my-page-default',
      fullPage: true,
    });
  });
});
```

2. Generate baseline:
   ```bash
   npx playwright test e2e/my-page.spec.ts --update-snapshots
   ```

3. Review and commit the baseline screenshots

## Troubleshooting

### Tests are flaky
- Increase wait times in `preparePageForVisualTest()`
- Add explicit waits for animations
- Mask dynamic content (dates, IDs, etc.)

### Screenshots look different locally vs CI
- Generate baselines in CI or use Docker for consistency
- Font rendering may vary between platforms

### Tests are slow
- Use `--project=chromium-desktop` for faster local development
- Run full browser matrix only in CI

## Resources

- 📚 [Full Documentation](./e2e/README.md)
- 🎭 [Playwright Docs](https://playwright.dev)
- 🔍 [Visual Testing Guide](https://playwright.dev/docs/test-snapshots)
- 🐛 [Troubleshooting Guide](./e2e/README.md#troubleshooting)

## Questions?

If you have questions about visual regression testing:
1. Check the [detailed documentation](./e2e/README.md)
2. Review existing test examples in `e2e/`
3. Open an issue for guidance

---

**Happy Testing! 🎉**
