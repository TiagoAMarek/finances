# Updating Visual Regression Baselines

## Overview

This guide explains how to update visual regression baseline screenshots when making intentional UI changes. All baselines are generated on CI (Ubuntu/Linux) to ensure consistency across the team and match the test environment.

---

## When to Update Baselines

Update baselines when you make **intentional** UI changes:

✅ **Update baselines for:**
- Layout changes (spacing, positioning, sizing)
- Style updates (colors, fonts, borders, shadows)
- Component refactoring that changes appearance
- New features that add UI elements
- Responsive design adjustments

❌ **DO NOT update baselines for:**
- Bugs or unintended visual changes
- Failing tests due to dynamic content (fix the mock data instead)
- Font rendering issues (these indicate environment problems)
- Flaky tests (investigate root cause)

---

## How to Update Baselines

### Method 1: Via GitHub UI (Recommended)

1. **Navigate to Actions**
   - Go to: `Actions` → `Generate Visual Regression Baselines`

2. **Run the Workflow**
   - Click "Run workflow" button
   - Select your branch from the dropdown
   - Select update mode: `chromium-only` (recommended)
   - Click "Run workflow" button

3. **Wait for Completion**
   - Workflow takes ~5-10 minutes
   - Monitor progress in the Actions tab

### Method 2: Via GitHub CLI

```bash
# From your local repository
gh workflow run generate-baselines.yml \
  -f branch=<your-branch-name> \
  -f update_mode=chromium-only
```

**Example:**
```bash
gh workflow run generate-baselines.yml \
  -f branch=feature/new-dashboard-layout \
  -f update_mode=chromium-only
```

---

## What Happens Next

### 1. Workflow Generates Baselines

The workflow will:
- ✅ Set up Ubuntu CI environment (matching test environment)
- ✅ Install dependencies and Playwright browsers
- ✅ Verify MSW (Mock Service Worker) is available
- ✅ Run all visual tests with `--update-snapshots` flag
- ✅ Generate 34 baseline screenshots with correct viewports:
  - **Mobile tests:** 375×667 pixels
  - **Desktop tests:** 1920×1080 pixels

### 2. Automatic PR Creation

The workflow automatically creates a Pull Request with:
- **Branch name:** `visual-baselines-<run-number>`
- **Title:** 📸 Visual Regression Baselines (chromium-only)
- **Files changed:** All updated baseline images in `e2e/__snapshots__/`
- **Labels:** `visual-testing`, `automated`, `baselines`

### 3. Automatic Testing

The `visual-tests.yml` workflow **automatically triggers** on the baseline PR to validate:
- ✅ All 34 visual regression tests pass
- ✅ Baselines are correctly generated
- ✅ Screenshots match when re-tested

**Result appears as:**
- PR check: "Visual Regression Tests (Optimized)"
- PR comment with test results

---

## Reviewing the Baseline PR

### Step 1: Check Test Results

Ensure the automated visual tests passed:
- Look for: ✅ **Visual Regression Tests (Optimized)** check
- Expected: `All checks have passed`
- View PR comment for summary: "✅ All visual regression tests passed!"

### Step 2: Review Sample Screenshots

Click on the **Files changed** tab and review some screenshots:

**Check for:**
- ✅ Pages are fully loaded (no loading spinners or skeleton screens)
- ✅ Fonts are properly rendered (no missing fonts or fallback fonts)
- ✅ No unexpected scrollbars
- ✅ Mobile screenshots show mobile layout (narrow, 375px width)
- ✅ Desktop screenshots show desktop layout (wide, 1920px width)
- ✅ UI elements are in expected positions
- ✅ Colors and styles match your changes

**File structure:**
```
e2e/__snapshots__/tests/
├── auth-pages.visual.spec.ts-snapshots/
│   ├── login-page-empty-chromium-desktop-linux.png
│   ├── login-page-filled-form-chromium-desktop-linux.png
│   └── ...
├── dashboard.visual.spec.ts-snapshots/
├── reports.visual.spec.ts-snapshots/
└── resources.visual.spec.ts-snapshots/
```

### Step 3: Merge the PR

Once verified:
1. ✅ Tests passed
2. ✅ Screenshots look correct
3. **Click "Merge pull request"**
4. Delete the branch (automatic via `delete-branch: true`)

---

## Troubleshooting

### Visual Tests Failed on the Baseline PR

**Symptom:** The automated visual tests show failures after baselines are generated.

**Possible Causes:**
1. **Non-deterministic mock data**
   - Check for: `Math.random()`, `new Date()`, `faker.*` in mock files
   - Fix: Use fixed values and sequential IDs

2. **Network requests not mocked**
   - Check: MSW handlers cover all API endpoints
   - Fix: Add missing MSW handlers in `__tests__/mocks/handlers/`

3. **Animations not disabled**
   - Check: Playwright config has `animations: 'disabled'`
   - Already configured in `e2e/utils/visual.ts`

4. **Environment differences**
   - Check: Workflow uses correct environment variables
   - Required: `NEXT_PUBLIC_USE_MOCKS=true`, `CI=true`

### Baselines Have Wrong Dimensions

**Symptom:** Mobile baselines are 1920×1080 instead of 375×667

**Cause:** Using `--project=chromium-desktop` flag which forces fixed viewport

**Fix:** ✅ Already fixed! Workflow now uses:
```bash
pnpm exec playwright test e2e/tests --update-snapshots
```
This respects fixture viewport settings.

### Can I Generate Baselines Locally?

**Short answer:** Not recommended.

**Why:**
- Font rendering differs between macOS and Linux
- Baselines must match CI environment (Ubuntu)
- Playwright generates OS-specific snapshots (`*-darwin.png` vs `*-linux.png`)

**If you need Linux baselines locally:**
Use Docker to run tests in a Linux container (advanced):
```bash
docker run --rm -v $(pwd):/work -w /work \
  mcr.microsoft.com/playwright:v1.49.0-noble \
  sh -c "npm install -g pnpm@10 && \
         pnpm install --frozen-lockfile && \
         NEXT_PUBLIC_USE_MOCKS=true pnpm exec playwright test e2e/tests --update-snapshots"
```

### Workflow Failed with "MSW Worker Not Found"

**Cause:** `public/mockServiceWorker.js` is missing

**Fix:** ✅ Already fixed! Workflow now auto-generates MSW worker if missing

### Wrong Branch Selected

**Symptom:** Workflow generated baselines for wrong branch

**Fix:** 
1. Delete the incorrect baseline PR
2. Re-run workflow with correct branch name
3. Baselines from wrong branch won't affect anything until merged

---

## Update Modes Explained

### chromium-only (Recommended)

**What it does:**
- Generates baselines for Chromium browser only
- Fastest option (~5-10 minutes)
- Generates ~34 baseline screenshots

**Use when:**
- ✅ Making UI changes to your feature branch
- ✅ Standard development workflow
- ✅ Most common scenario

### all

**What it does:**
- Generates baselines for all browsers (Chromium, Firefox, WebKit)
- Slower (~20-30 minutes)
- Generates ~100+ baseline screenshots

**Use when:**
- 🔶 Setting up visual tests for the first time
- 🔶 Major cross-browser compatibility changes
- 🔶 Rarely needed for day-to-day development

### missing-only

**What it does:**
- Only generates baselines that don't exist yet
- Skips existing baselines

**Use when:**
- 🔶 Adding new test cases
- 🔶 Fixing missing baseline files
- 🔶 Specific edge cases

---

## Best Practices

### DO:
- ✅ Update baselines when you intentionally change UI
- ✅ Review sample screenshots before merging
- ✅ Ensure visual tests pass on the baseline PR
- ✅ Keep mock data deterministic
- ✅ Use descriptive commit messages when merging baseline PRs

### DON'T:
- ❌ Manually edit baseline screenshots
- ❌ Generate baselines locally on macOS (unless using Docker)
- ❌ Update baselines to "fix" failing tests without understanding why
- ❌ Merge baseline PRs with failing visual tests
- ❌ Skip reviewing the generated screenshots

---

## Example Workflow

### Scenario: Updated Dashboard Layout

**1. You made UI changes to the dashboard:**
```bash
# Local development
git checkout -b feature/improve-dashboard-layout
# ... make changes to dashboard components ...
git commit -m "feat: improve dashboard card spacing and colors"
git push origin feature/improve-dashboard-layout
```

**2. Visual tests fail on your PR:**
- CI runs visual tests
- Dashboard tests fail: "Screenshot doesn't match baseline"
- This is expected! You changed the UI.

**3. Generate new baselines:**
```bash
# Trigger baseline generation workflow
gh workflow run generate-baselines.yml \
  -f branch=feature/improve-dashboard-layout \
  -f update_mode=chromium-only
```

**4. Review the baseline PR:**
- Workflow creates PR: "📸 Visual Regression Baselines (chromium-only)"
- Visual tests run automatically on the PR
- Check: ✅ All 34 tests passed
- Review: Dashboard screenshots show your new layout

**5. Merge both PRs:**
```bash
# Merge baseline PR first
gh pr merge <baseline-pr-number> --squash

# Now your feature PR's visual tests should pass
# Merge your feature PR
gh pr merge <feature-pr-number> --squash
```

---

## FAQ

**Q: How often should I update baselines?**  
A: Only when you make intentional UI changes. Not on every commit.

**Q: What if I have multiple developers working on UI changes?**  
A: Coordinate baseline updates. Merge them sequentially, not in parallel.

**Q: Can I update baselines for just one page?**  
A: Not directly, but the workflow only regenerates what's changed. Unchanged pages keep the same baselines.

**Q: What if baselines are outdated on the main branch?**  
A: Run the workflow on `main` branch and merge the PR to update all baselines.

**Q: Are baselines platform-specific?**  
A: Yes! We use `*-linux.png` for CI (Ubuntu). macOS developers would have `*-darwin.png` files (not committed).

---

## Related Documentation

- [CI_VISUAL_TESTS_PLAN.md](./CI_VISUAL_TESTS_PLAN.md) - Original implementation plan
- [PHASE_3_COMPLETE.md](./PHASE_3_COMPLETE.md) - CI optimization details
- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots) - Official docs

---

## Getting Help

**If visual tests fail unexpectedly:**
1. Check CI logs in GitHub Actions
2. Download visual diffs from workflow artifacts
3. Review mock data for non-deterministic content
4. Consult this guide for troubleshooting steps

**If baselines seem incorrect:**
1. Verify workflow used `chromium-only` mode
2. Check baseline file dimensions with `file` command
3. Re-run workflow if needed

**For questions:**
- Open an issue in the repository
- Tag team members with visual testing experience
- Reference this documentation in discussions
