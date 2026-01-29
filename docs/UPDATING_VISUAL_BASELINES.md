# Updating Visual Regression Baselines

## Overview

This guide explains how to update visual regression baseline screenshots when making intentional UI changes. All baselines are generated using **Docker** to ensure they exactly match the CI Linux environment, eliminating font rendering and platform differences.

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

### Method 1: Via GitHub Actions (Easiest)

1. **Navigate to Actions**
   - Go to: `Actions` → `Generate Visual Regression Baselines`

2. **Run the Workflow**
   - Click "Run workflow" button
   - Select your branch from the dropdown
   - Click "Run workflow" button

3. **Wait for Completion**
   - Workflow takes ~10-15 minutes
   - Baselines are generated in Docker container
   - Automatic PR is created with updated baselines

### Method 2: Locally with Docker (Recommended for Development)

```bash
# Make sure Docker is running
docker --version

# Run the helper script
./scripts/update-visual-baselines.sh
```

This script will:
- ✅ Build Docker image with Linux + Playwright environment
- ✅ Generate all baselines in the exact CI environment
- ✅ Update files in `e2e/__snapshots__/`
- ✅ Show you git changes

Then commit and push:
```bash
git add e2e/__snapshots__/
git commit -m "chore(tests): update visual regression baselines"
git push
```

### Method 3: Via GitHub CLI

```bash
gh workflow run generate-baselines.yml -f branch=<your-branch-name>
```

---

## What Happens Next

### 1. Docker-Based Generation

The workflow/script will:
- ✅ Build Docker image using `mcr.microsoft.com/playwright:v1.49.1-noble`
- ✅ Install dependencies inside container
- ✅ Run visual tests with `--update-snapshots`
- ✅ Generate 34 baseline screenshots with correct viewports:
  - **Mobile tests:** 375×667 pixels
  - **Desktop tests:** 1920×1080 pixels
- ✅ Baselines match CI environment **exactly** (no font rendering differences)

### 2. Automatic PR Creation (GitHub Actions only)

The workflow automatically creates a Pull Request with:
- **Branch name:** `visual-baselines-<run-number>`
- **Title:** 📸 Update Visual Regression Baselines
- **Files changed:** All updated baseline images in `e2e/__snapshots__/`
- **Labels:** `visual-testing`, `automated`, `baselines`

### 3. Automatic Testing

The `visual-tests.yml` workflow automatically triggers to validate:
- ✅ All 34 visual regression tests pass
- ✅ Baselines are correctly generated
- ✅ Screenshots match when re-tested in CI

---

## Docker Setup Details

### Dockerfile

Location: `Dockerfile.visual-tests`

Based on official Playwright image to ensure:
- Same Linux distribution as CI (Ubuntu Noble)
- Same Chromium version
- Same font rendering
- Same system dependencies

### Docker Compose

Location: `docker-compose.visual-tests.yml`

Provides:
- Volume mounts for source code
- Volume mount for `e2e/__snapshots__/` to get updated baselines
- Environment variables (`NEXT_PUBLIC_USE_MOCKS=true`, `CI=true`)

### Helper Script

Location: `scripts/update-visual-baselines.sh`

Automates the entire process:
```bash
./scripts/update-visual-baselines.sh
```

---

## Reviewing Changes

### Check Test Results (CI only)

Ensure the automated visual tests passed:
- Look for: ✅ **Visual Regression Tests (Optimized)** check
- Expected: `All checks have passed`

### Review Screenshots

**Check for:**
- ✅ Pages are fully loaded (no loading spinners)
- ✅ Fonts are properly rendered
- ✅ No unexpected scrollbars
- ✅ Mobile screenshots show mobile layout (375px width)
- ✅ Desktop screenshots show desktop layout (1920px width)
- ✅ UI elements are in expected positions

**File structure:**
```
e2e/__snapshots__/tests/
├── auth-pages.visual.spec.ts-snapshots/
│   ├── login-page-empty-chromium-desktop.png
│   ├── login-page-filled-form-chromium-desktop.png
│   └── ...
├── dashboard.visual.spec.ts-snapshots/
├── reports.visual.spec.ts-snapshots/
└── resources.visual.spec.ts-snapshots/
```

Note: No `-linux` or `-darwin` suffixes needed! Docker baselines work everywhere.

---

## Troubleshooting

### Visual Tests Failed After Updating Baselines

**Possible Causes:**
1. **Non-deterministic mock data**
   - Fix: Use fixed values and sequential IDs

2. **Network requests not mocked**
   - Fix: Add missing MSW handlers

3. **Animations not disabled**
   - Already configured in `e2e/utils/visual.ts`

### Docker Command Failed

**Symptom:** Docker build or run fails

**Fix:**
```bash
# Make sure Docker is running
docker ps

# Clean old images if needed
docker system prune -a

# Rebuild without cache
docker compose -f docker-compose.visual-tests.yml build --no-cache
```

### Baselines Have Wrong Dimensions

**Symptom:** Mobile baselines are wrong size

**Cause:** Viewport configuration issue

**Fix:** Already configured! Test fixtures set viewport at context creation time.

### Permission Errors on macOS/Linux

**Symptom:** Cannot write to `e2e/__snapshots__/`

**Fix:**
```bash
# Docker may create files as root; fix ownership
sudo chown -R $(whoami):$(whoami) e2e/__snapshots__/
```

---

## Best Practices

### DO:
- ✅ Use Docker to generate baselines (locally or CI)
- ✅ Review sample screenshots before committing
- ✅ Ensure visual tests pass after updating
- ✅ Keep mock data deterministic
- ✅ Commit baseline updates in separate commits

### DON'T:
- ❌ Manually edit baseline screenshots
- ❌ Generate baselines without Docker (will not match CI)
- ❌ Update baselines to "fix" failing tests without understanding why
- ❌ Merge PRs with failing visual tests
- ❌ Skip reviewing the generated screenshots

---

## Example Workflow

### Scenario: Updated Dashboard Layout

**1. Make UI changes:**
```bash
git checkout -b feature/improve-dashboard-layout
# ... make changes ...
git commit -m "feat: improve dashboard card spacing"
git push
```

**2. Visual tests fail (expected):**
- CI shows: "Screenshot doesn't match baseline"

**3. Update baselines with Docker:**
```bash
# Local update
./scripts/update-visual-baselines.sh

# Commit
git add e2e/__snapshots__/
git commit -m "chore(tests): update baselines for new dashboard layout"
git push
```

**4. Visual tests now pass:**
- CI re-runs visual tests
- ✅ All tests pass with new baselines

---

## FAQ

**Q: Why use Docker?**  
A: Eliminates font rendering differences between macOS/Windows and Linux CI. Ensures baselines work everywhere.

**Q: Can I generate baselines without Docker?**  
A: Not recommended. They won't match CI and tests will fail.

**Q: How long does Docker generation take?**  
A: First build: ~5 minutes. Subsequent runs: ~2-3 minutes.

**Q: Do I need to commit Docker files?**  
A: Yes! `Dockerfile.visual-tests` and `docker-compose.visual-tests.yml` should be in git.

**Q: What if I don't have Docker installed?**  
A: Install Docker Desktop, or use the GitHub Actions workflow instead.

---

## Related Documentation

- [Playwright Visual Comparisons](https://playwright.dev/docs/test-snapshots) - Official docs
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

## Getting Help

**If visual tests fail unexpectedly:**
1. Check CI logs in GitHub Actions
2. Download visual diffs from workflow artifacts
3. Review mock data for non-deterministic content

**If Docker fails:**
1. Ensure Docker is running: `docker ps`
2. Check disk space: `docker system df`
3. Clean Docker cache: `docker system prune`

**For questions:**
- Open an issue in the repository
- Tag team members with visual testing experience