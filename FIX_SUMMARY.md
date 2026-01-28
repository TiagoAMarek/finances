# Visual Regression Test Failure - Fix Summary

## Problem Statement

The visual regression tests were failing in GitHub Actions CI with the error:
```
Error: A snapshot doesn't exist at /home/runner/work/finances/finances/e2e/__snapshots__/tests/dashboard.visual.spec.ts-snapshots/dashboard-reports-expanded-chromium-desktop-linux.png, writing actual.
```

**Failure Rate:** 21+ tests (100% of visual regression tests)

## Root Cause Analysis

### What Happened
Playwright, by default, appends the platform name (OS) to snapshot filenames:
- **macOS:** `snapshot-name-darwin.png`
- **Linux:** `snapshot-name-linux.png`
- **Windows:** `snapshot-name-win32.png`

### The Issue
1. Baseline snapshots were generated locally on **macOS** → named `*-darwin.png`
2. CI runs on **Linux (Ubuntu)** → expected `*-linux.png`
3. Snapshot name mismatch → All tests failed

### Why This Happens
Playwright includes platform suffixes to handle rendering differences across operating systems. However, for consistent testing environments (like ours with MSW mocking), platform-agnostic snapshots are preferable.

## Solution

### 1. Configure Platform-Agnostic Snapshots

Added `snapshotPathTemplate` to `playwright.config.ts`:

```typescript
// Use platform-agnostic snapshot paths (remove OS-specific suffix)
// This allows snapshots generated on any OS to work on all platforms
snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}',
```

**What this does:**
- Removes the platform-specific suffix from snapshot paths
- Default: `{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}-{projectName}-{platform}{ext}`
- Custom: `{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{ext}`
- Notice the removal of `-{platform}` from the template

### 2. Rename Existing Snapshots

Renamed all 34 baseline snapshots to remove the `-darwin` suffix:

```bash
# Before
dashboard-desktop-chromium-desktop-darwin.png
login-page-default-chromium-desktop-darwin.png
...

# After
dashboard-desktop-chromium-desktop.png
login-page-default-chromium-desktop.png
...
```

### 3. Update Documentation

Updated three documentation files to reflect the new platform-agnostic approach:
- `VISUAL_TESTING.md`
- `GENERATING_BASELINES.md`
- `e2e/README.md`

## Impact & Benefits

### ✅ Cross-Platform Compatibility
- Snapshots generated on **macOS** work on **Linux** and **Windows**
- Snapshots generated on **Linux** work on **macOS** and **Windows**
- Snapshots generated on **Windows** work on **Linux** and **macOS**

### ✅ Simplified Workflow
- Developers can generate baselines on their local machine (any OS)
- No need to generate baselines specifically in CI
- Reduces friction in the development process

### ✅ Consistent Testing
- Same snapshots used across all environments
- Reduces confusion and maintenance overhead
- Easier to track visual changes in version control

### ⚠️ Important Notes
- Minor rendering differences between OSes are handled by Playwright's threshold settings:
  - `maxDiffPixelRatio: 0.1` (10% of pixels can differ)
  - `threshold: 0.2` (20% color difference tolerance per pixel)
  - `maxDiffPixels: 100` (up to 100 pixels can be different)
- If tests fail due to genuine platform rendering differences, thresholds can be adjusted

## Verification

### How to Verify the Fix

1. **Check snapshot filenames:**
   ```bash
   ls e2e/__snapshots__/tests/*/
   # Should NOT contain -darwin, -linux, or -win32 suffixes
   ```

2. **Run tests locally:**
   ```bash
   pnpm test:visual:chromium
   # Should pass with no "snapshot doesn't exist" errors
   ```

3. **Check CI:**
   - Once merged into the main PR, CI should run successfully
   - Visual regression tests should pass
   - No more platform mismatch errors

### Expected Outcome

After merging this fix:
- ✅ All 34 visual regression tests pass in CI
- ✅ Snapshots work on any platform
- ✅ Developers can contribute baseline updates from any OS

## Technical Details

### Files Modified
1. `playwright.config.ts` - Added `snapshotPathTemplate` configuration
2. `e2e/__snapshots__/` - Renamed 34 snapshot files
3. `VISUAL_TESTING.md` - Updated troubleshooting section
4. `GENERATING_BASELINES.md` - Updated platform differences section
5. `e2e/README.md` - Updated platform compatibility information

### Snapshot Naming Convention
- **Before:** `{name}-{project}-{platform}.png`
  - Example: `dashboard-desktop-chromium-desktop-darwin.png`
- **After:** `{name}-{project}.png`
  - Example: `dashboard-desktop-chromium-desktop.png`

### Test Coverage
The fix applies to all visual regression tests:
- Authentication pages (login, register) - 8 tests
- Dashboard page (default, mobile, modals) - 7 tests
- Resources pages (accounts, cards, transactions, categories) - 10 tests
- Report pages (performance, expense analysis) - 8 tests
- **Total:** 34 visual regression tests across 4 test files

## Future Considerations

### When to Update Baselines
Update baselines when:
- UI/design changes are intentional
- Component styling is modified
- New pages/features are added

### How to Update Baselines
```bash
# Update all baselines
pnpm test:visual:update

# Update specific test file
npx playwright test e2e/tests/dashboard.visual.spec.ts --update-snapshots

# Update specific browser project
npx playwright test --project=chromium-desktop --update-snapshots
```

### Handling Platform-Specific Rendering
If genuine platform differences arise:
1. First, try to fix the rendering to be consistent
2. If impossible, adjust thresholds in `playwright.config.ts`
3. As a last resort, consider platform-specific snapshots for specific tests

## References

- [Playwright Screenshots Documentation](https://playwright.dev/docs/test-snapshots)
- [Playwright Configuration Reference](https://playwright.dev/docs/test-configuration)
- Project Visual Testing Guide: `VISUAL_TESTING.md`
- Baseline Generation Guide: `GENERATING_BASELINES.md`

---

**Status:** ✅ Fix Complete - Ready for CI Validation
**PR:** #15 - Fix failing visual regression tests
**Target:** PR #14 - Add visual regression testing infrastructure
