# Generating Baseline Screenshots - Step-by-Step Guide

This guide provides detailed instructions for generating the baseline screenshots for visual regression tests.

## Prerequisites

Before generating baselines, ensure you have:

- ✅ Node.js 20+ installed
- ✅ pnpm installed (`npm install -g pnpm`)
- ✅ Project dependencies installed (`pnpm install`)
- ✅ Network access to download Playwright browsers (~500MB)

## Quick Start (Recommended)

We've provided a script that automates the entire process:

```bash
# From the project root directory
./scripts/generate-visual-baselines.sh
```

This script will:
1. ✅ Verify project structure
2. 📦 Install dependencies (if needed)
3. 🌐 Install Playwright browsers (Chromium, Firefox, WebKit)
4. 📸 Generate all 252 baseline screenshots
5. 💾 Save them to `e2e/__snapshots__/`

**Expected time:** 5-10 minutes

## Manual Generation

If you prefer to run commands manually:

### Step 1: Install Dependencies

```bash
pnpm install
```

### Step 2: Install Playwright Browsers

For all browsers (recommended):
```bash
pnpm exec playwright install chromium firefox webkit
```

For quick testing (Chromium only):
```bash
pnpm exec playwright install chromium
```

### Step 3: Generate Baselines

```bash
# Update all snapshots
pnpm test:visual:update
```

Or for specific browsers:
```bash
# Chromium only (faster for initial setup)
pnpm exec playwright test --project=chromium-desktop --update-snapshots

# All browsers
pnpm exec playwright test --update-snapshots
```

## What Happens During Generation

### 1. Dev Server Starts
- Next.js dev server starts on `http://localhost:3000`
- MSW (Mock Service Worker) is enabled via `NEXT_PUBLIC_USE_MOCKS=true`
- Provides consistent test data across runs

### 2. Tests Execute
- **42 test cases** run across **6 browser configurations**
- Each test navigates to a page and captures a screenshot
- Total: **252 screenshot comparisons**

### 3. Screenshots Saved
Directory structure created:
```
e2e/__snapshots__/
├── chromium-desktop/
│   ├── login-page-default.png
│   ├── login-page-mobile.png
│   ├── dashboard-default.png
│   └── ... (~42 screenshots)
├── firefox-desktop/
│   └── ... (~42 screenshots)
├── webkit-desktop/
│   └── ... (~42 screenshots)
├── tablet/
│   └── ... (~42 screenshots)
├── mobile-chrome/
│   └── ... (~42 screenshots)
└── mobile-safari/
    └── ... (~42 screenshots)
```

## Verification Steps

### 1. Check Screenshot Count

```bash
find e2e/__snapshots__ -name "*.png" | wc -l
```

**Expected:** ~252 screenshots (42 tests × 6 browser configs)

### 2. Review Sample Screenshots

```bash
# View login page
open e2e/__snapshots__/chromium-desktop/login-page-default.png

# View dashboard
open e2e/__snapshots__/chromium-desktop/dashboard-default.png

# View mobile version
open e2e/__snapshots__/mobile-chrome/login-page-mobile.png

# View dark mode
open e2e/__snapshots__/chromium-desktop/login-page-dark-mode.png
```

Or use `ls` to browse:
```bash
ls e2e/__snapshots__/chromium-desktop/
```

### 3. Quality Checks

Verify that screenshots:
- ✅ Are clear and readable
- ✅ Show fully loaded pages (no loading spinners)
- ✅ Have proper fonts rendered
- ✅ Don't show scrollbars
- ✅ Dark mode screenshots are actually dark
- ✅ Mobile screenshots show mobile viewport
- ✅ Modals/accordions are in correct state

### 4. Test Against Baselines

```bash
# Run tests to ensure baselines work
pnpm test:visual:chromium
```

**Expected:** All tests should pass (green checkmarks)

## Committing Baselines

Once you've verified the screenshots look good:

```bash
# Stage the snapshots
git add e2e/__snapshots__/

# Commit them
git commit -m "chore: Add baseline screenshots for visual regression tests"

# Push to repository
git push
```

**Important:** Baselines must be committed to the repository so that:
- CI can compare against them
- Team members have the same baselines
- Visual changes can be tracked in PRs

## Troubleshooting

### Problem: Playwright browsers won't download

**Symptoms:**
```
Error: Download failed: server returned code 403
```

**Solutions:**
1. Check your network connection
2. Try using a VPN if behind a proxy
3. Download browsers manually:
   ```bash
   npx playwright install --force chromium
   ```

### Problem: Tests fail during generation

**Symptoms:**
```
Error: page.goto: Timeout 30000ms exceeded
```

**Solutions:**
1. Ensure dev server is running: `pnpm dev` in another terminal
2. Check port 3000 is not in use: `lsof -i :3000`
3. Increase timeout in `playwright.config.ts` (line 19)

### Problem: Screenshots are blank or incomplete

**Symptoms:**
- White/blank screenshots
- Missing content

**Solutions:**
1. Ensure MSW is properly configured: `NEXT_PUBLIC_USE_MOCKS=true`
2. Check that mock data exists in `__tests__/mocks/`
3. Wait longer for page load - increase `waitMs` in tests

### Problem: Different screenshots on different machines

**Symptoms:**
- Tests pass locally but fail in CI
- Fonts look different

**Solutions:**
1. Use Docker for consistent environment
2. Generate baselines in CI environment
3. Adjust visual comparison thresholds in `playwright.config.ts`

### Problem: Too many screenshots to review

**Solution:**
Use the HTML report to view all screenshots:
```bash
pnpm test:visual:update
pnpm test:visual:report
```

## CI Generation (Alternative)

If you can't generate locally, you can use CI:

1. Push your code without baselines
2. Create a PR
3. CI will run and fail (expected - no baselines)
4. Download failed test artifacts from CI
5. Extract screenshots from artifacts
6. Place them in `e2e/__snapshots__/`
7. Commit and push

## Updating Baselines

When you intentionally change the UI:

```bash
# Update all baselines
pnpm test:visual:update

# Update specific test
npx playwright test e2e/dashboard.spec.ts --update-snapshots

# Update specific browser
npx playwright test --project=chromium-desktop --update-snapshots
```

## Best Practices

### When to Generate New Baselines

- ✅ Initial setup (first time)
- ✅ After intentional UI/design changes
- ✅ When adding new pages/components
- ✅ After updating dependencies that affect rendering

### When NOT to Generate New Baselines

- ❌ When tests are failing unexpectedly
- ❌ Without reviewing the changes first
- ❌ On different machines without verification
- ❌ When there are code bugs causing visual issues

### Review Process

1. **Before generating:** Ensure UI looks correct manually
2. **After generating:** Review screenshots for quality
3. **Before committing:** Run tests to verify baselines work
4. **In PR:** Review baseline changes alongside code changes

## Resources

- **Quick Start:** `VISUAL_TESTING.md`
- **Full Documentation:** `e2e/README.md`
- **Verification Checklist:** `VERIFICATION_CHECKLIST.md`
- **Implementation Details:** `IMPLEMENTATION_SUMMARY.md`

## Getting Help

If you encounter issues:
1. Check this guide's troubleshooting section
2. Review `e2e/README.md#troubleshooting`
3. Check Playwright documentation: https://playwright.dev
4. Open an issue with:
   - Error messages
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)

---

**Time Investment:** First-time setup takes 10-15 minutes including browser downloads. Subsequent baseline updates take 5-10 minutes.

**Disk Space:** Baseline screenshots require ~50-100MB of storage.

**Network:** Browser downloads require ~500MB bandwidth (one-time).

---

Happy testing! 🎉
