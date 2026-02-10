# Visual Regression Test Stability Guide

## Overview

This document outlines the comprehensive approach to fixing chart flakiness in Playwright visual regression tests for the Finance Management Application.

## Problem Statement

Recharts-based visualizations in visual regression tests were experiencing intermittent failures due to:
- Animation timing inconsistencies
- SVG rendering race conditions  
- Asynchronous data loading variations
- Browser viewport painting timing differences

## Solution Architecture

### 1. Browser-Level Animation Disabling

**Location**: `e2e/utils/visual.ts` - `disableAnimations()` function

**Implementation**:
```typescript
// Emulate prefers-reduced-motion at browser level
await page.emulateMedia({ reducedMotion: 'reduce' });

// Comprehensive CSS rules
await page.addStyleTag({
  content: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0s !important;
      transition-delay: 0s !important;
      transition-property: none !important;
      scroll-behavior: auto !important;
    }
    
    /* SVG-specific rules for charts */
    svg { animation: none !important; }
    svg * {
      animation: none !important;
      transition: none !important;
    }
    
    /* Additional stability */
    * { caret-color: transparent !important; }
    html { filter: none !important; }
  `
});

// Override matchMedia for component-level checks
await page.evaluate(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => {
      if (query === '(prefers-reduced-motion: reduce)') {
        return { matches: true, /* ... */ };
      }
      return originalMatchMedia.call(window, query);
    },
  });
});
```

**Why This Works**:
- CSS rules catch any animations not controlled by JavaScript
- Browser-level emulation affects native behavior
- matchMedia override ensures components respect the setting

### 2. Component-Level Animation Control

**Locations**:
- `features/shared/components/IncomeVsExpenseChart/Chart.tsx`
- `features/shared/components/AdvancedExpenseAnalysis/ExpenseAnalysisChart.tsx`

**Implementation**:
```typescript
const isAnimationActive = useMemo(() => {
  // SSR safety check
  if (typeof window === 'undefined') return true;
  
  // Disable in test environments
  return process.env.NODE_ENV !== 'test' && 
         process.env.NEXT_PUBLIC_USE_MOCKS !== 'true';
}, []);

// Apply to Recharts components
<Bar dataKey="receitas" isAnimationActive={isAnimationActive} />
<Line dataKey="total" isAnimationActive={isAnimationActive} />
```

**Why This Works**:
- `useMemo` prevents re-evaluation on every render
- Runtime check avoids build-time environment variable access
- SSR safety with `typeof window` check
- Production animations preserved for UX

**Critical Fix**: Moving environment check from module-level to component-level prevents JWT_SECRET validation errors during Next.js build phase.

### 3. Enhanced Chart Waiting Strategy

**Location**: `e2e/utils/smart-wait.ts` - `waitForChartsToRender()` function

**Multi-Stage Verification**:

```typescript
// Stage 1: SVG Surface Detection (5s timeout)
await page.waitForSelector('.recharts-surface', { 
  state: 'visible',
  timeout: 5000 
});

// Stage 2: Content Verification (5s timeout)
await page.waitForFunction(() => {
  const svgs = document.querySelectorAll('.recharts-surface');
  return Array.from(svgs).every(svg => {
    const hasContent = svg.querySelector('path, rect, line, circle, text');
    return hasContent !== null;
  });
}, { timeout: 5000 });

// Stage 3: Dimension Stability (3s timeout)
await page.waitForFunction(() => {
  const charts = document.querySelectorAll('.recharts-wrapper');
  return Array.from(charts).every(chart => {
    const svg = chart.querySelector('svg');
    if (!svg) return false;
    
    const rect = svg.getBoundingClientRect();
    return rect && rect.width > 0 && rect.height > 0;
  });
}, { timeout: 3000 });

// Stage 4: Paint Cycle Completion
await page.evaluate(() => new Promise(resolve => {
  requestAnimationFrame(() => {
    requestAnimationFrame(resolve);
  });
}));

// Stage 5: Final Stabilization (50ms)
await page.waitForTimeout(50);
```

**Why This Works**:
- **Stage 1**: Ensures DOM elements exist and are visible
- **Stage 2**: Verifies actual chart content has rendered (not just empty SVGs)
- **Stage 3**: Confirms layout is stable with real dimensions
- **Stage 4**: Double RAF ensures browser has completed rendering
- **Stage 5**: Buffer for any final paint operations

## Testing Protocol

### Local Testing
```bash
# Run visual tests multiple times
for i in {1..10}; do
  echo "Run $i:"
  pnpm test:visual
done

# Check for consistency
# Success rate should be >95%
```

### CI Monitoring
1. Check GitHub Actions workflow results
2. Look for patterns in failures:
   - Specific test cases
   - Specific viewports (mobile/tablet/desktop)
   - Specific themes (light/dark)
   - Specific chart types (bar/line)

### Failure Analysis
If tests fail intermittently:
1. Check screenshot diffs for the nature of difference
2. Identify if it's:
   - Animation mid-flight
   - Missing chart elements
   - Layout shift
   - Font rendering difference

## Advanced Troubleshooting

### If Flakiness Persists (Success Rate < 95%)

#### Option 1: Increase Timeouts
```typescript
// In smart-wait.ts
await page.waitForSelector('.recharts-surface', { 
  state: 'visible',
  timeout: 7000  // Was 5000
});

await page.waitForFunction(/* ... */, { timeout: 7000 });  // Was 5000
await page.waitForFunction(/* ... */, { timeout: 5000 });  // Was 3000
```

#### Option 2: Chart-Specific Selectors
```typescript
// Wait for specific Recharts elements
await page.waitForSelector('.recharts-bar-rectangle', { timeout: 5000 });
await page.waitForSelector('.recharts-line-curve', { timeout: 5000 });
await page.waitForSelector('.recharts-cartesian-axis', { timeout: 5000 });
```

#### Option 3: Font Loading
```typescript
// Ensure fonts are loaded before screenshot
await page.evaluate(() => document.fonts.ready);
```

#### Option 4: Multiple Stability Verification
```typescript
async function ensureStableScreenshot(page: Page) {
  const screenshot1 = await page.screenshot();
  await page.waitForTimeout(100);
  const screenshot2 = await page.screenshot();
  
  // Compare screenshots, retry if different
  if (!buffersEqual(screenshot1, screenshot2)) {
    await page.waitForTimeout(200);
    return ensureStableScreenshot(page);
  }
}
```

#### Option 5: Playwright Configuration
```typescript
// In playwright.config.ts
use: {
  launchOptions: {
    args: [
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--disable-dev-shm-usage',
      '--no-sandbox',
    ]
  },
  // Force consistent rendering
  deviceScaleFactor: 1,
  hasTouch: false,
}
```

## Implementation Checklist

- [x] **Browser-level animation disabling**
  - [x] `page.emulateMedia({ reducedMotion: 'reduce' })`
  - [x] Comprehensive CSS rules
  - [x] SVG-specific disabling
  - [x] matchMedia override

- [x] **Component-level animation control**
  - [x] IncomeVsExpenseChart with `isAnimationActive`
  - [x] ExpenseAnalysisChart with `isAnimationActive`
  - [x] Runtime environment check with `useMemo`
  - [x] SSR safety

- [x] **Enhanced chart waiting**
  - [x] SVG surface detection
  - [x] Content verification
  - [x] Dimension stability check
  - [x] Double requestAnimationFrame
  - [x] 50ms stabilization buffer

- [ ] **Monitoring & validation**
  - [ ] Run tests 10+ times locally
  - [ ] Monitor CI success rate
  - [ ] Document failure patterns if any
  - [ ] Apply additional fixes if needed

## Success Metrics

- **Target**: >95% test pass rate
- **Current**: To be measured after implementation
- **Measurement Period**: 20 CI runs

## Community Best Practices Reference

This implementation follows recommendations from:
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Percy Visual Testing Guide](https://docs.percy.io/docs)
- [Chromatic Docs](https://www.chromatic.com/docs/)
- [Visual Regression Testing Dev Guide](https://www.visual-regression-testing.dev/)
- [428-Day Battle Against Flaky Screenshots](https://turntrout.com/playwright-tips)

## Maintenance

### When Adding New Charts
1. Ensure `isAnimationActive` prop is used
2. Test locally with animations disabled
3. Verify chart renders correctly in test mode
4. Update baselines if needed

### When Updating Recharts
1. Test visual regression suite after update
2. Check for new animation properties
3. Update CSS rules if needed
4. Re-baseline if rendering changes

### Debugging Flaky Tests
1. Run test in headed mode: `pnpm test:visual:debug`
2. Check browser console for errors
3. Verify network requests complete
4. Check animation states
5. Inspect element dimensions

## Related Files

- `e2e/utils/visual.ts` - Animation disabling utilities
- `e2e/utils/smart-wait.ts` - Chart waiting strategies
- `e2e/fixtures/visual-test.ts` - Test fixtures with date mocking
- `e2e/config/constants.ts` - Fixed date constant
- `features/shared/components/IncomeVsExpenseChart/Chart.tsx` - Bar chart component
- `features/shared/components/AdvancedExpenseAnalysis/ExpenseAnalysisChart.tsx` - Line chart component
- `playwright.config.ts` - Playwright configuration

## Conclusion

The current implementation represents industry best practices for stable visual regression testing with animated charts. If flakiness persists after these changes, apply the advanced troubleshooting options in order, measuring success rate after each change.
