import { Page } from '@playwright/test';

/**
 * Smart waiting utilities that replace fixed timeouts with
 * condition-based waiting for better performance and reliability.
 */

/**
 * Wait for all Recharts to be fully rendered
 * Implements community best practices for chart stability
 * This replaces the 1500ms hard-coded wait for charts
 */
export async function waitForChartsToRender(page: Page): Promise<void> {
  const charts = page.locator('.recharts-wrapper');
  const count = await charts.count();
  
  if (count === 0) {
    // No charts on page, return immediately
    return;
  }
  
  try {
    // Wait for chart SVG surfaces to be visible
    await page.waitForSelector('.recharts-surface', { 
      state: 'visible',
      timeout: 5000 
    });
    
    // Wait for chart content to be rendered (paths, rects, lines, etc.)
    await page.waitForFunction(
      () => {
        const svgs = document.querySelectorAll('.recharts-surface');
        if (svgs.length === 0) return false;
        
        // Check if all SVGs have actual content rendered
        return Array.from(svgs).every(svg => {
          const hasContent = svg.querySelector('path, rect, line, circle, text');
          return hasContent !== null;
        });
      },
      { timeout: 5000 }
    );
    
    // Wait for chart dimensions to stabilize (community best practice)
    await page.waitForFunction(
      () => {
        const charts = document.querySelectorAll('.recharts-wrapper');
        return Array.from(charts).every(chart => {
          const svg = chart.querySelector('svg');
          if (!svg) return false;
          
          // Verify SVG has non-zero computed dimensions
          const rect = svg.getBoundingClientRect();
          return rect && rect.width > 0 && rect.height > 0;
        });
      },
      { timeout: 3000 }
    );
    
    // Small stabilization delay to ensure all rendering is complete
    // This is a community-recommended practice for chart libraries
    await page.evaluate(() => new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    }));
    
    // Additional 50ms buffer for any final paint operations
    await page.waitForTimeout(50);
    
  } catch (error) {
    // If waiting fails, chart might not be present or already rendered
    // Don't fail the test, just continue
    console.warn('Chart rendering wait timed out, continuing anyway');
  }
}

/**
 * Wait for network to be truly idle (no requests for a period)
 * More reliable than waitForLoadState('networkidle')
 */
export async function waitForNetworkQuiet(
  page: Page, 
  quietPeriod = 500,
  timeout = 5000
): Promise<void> {
  let lastRequestTime = Date.now();
  let isComplete = false;
  
  const requestListener = () => {
    lastRequestTime = Date.now();
  };
  
  page.on('request', requestListener);
  
  try {
    await page.waitForFunction(
      ({ lastTime, quietMs }) => Date.now() - lastTime >= quietMs,
      { lastTime: lastRequestTime, quietMs: quietPeriod },
      { timeout }
    );
    isComplete = true;
  } catch (error) {
    // Timeout reached, network might still be active but we need to proceed
    console.warn('Network quiet timeout reached');
  } finally {
    page.off('request', requestListener);
  }
}

/**
 * Wait for all images to complete loading
 * Returns immediately if all images are already loaded
 */
export async function waitForImagesToLoad(page: Page): Promise<void> {
  await page.evaluate(() => {
    return new Promise<void>((resolve) => {
      const images = Array.from(document.images).filter(img => !img.complete);
      
      if (images.length === 0) {
        resolve();
        return;
      }
      
      let loadedCount = 0;
      const totalImages = images.length;
      
      images.forEach(img => {
        const handleLoad = () => {
          loadedCount++;
          if (loadedCount === totalImages) {
            resolve();
          }
        };
        
        img.onload = handleLoad;
        img.onerror = handleLoad; // Resolve even on error to not block
        
        // Safety timeout per image
        setTimeout(handleLoad, 3000);
      });
    });
  });
}

/**
 * Wait for fonts to be loaded
 * Returns immediately if document.fonts API is not available
 */
export async function waitForFontsToLoad(page: Page): Promise<void> {
  try {
    await page.evaluate(() => {
      if (!document.fonts || !document.fonts.ready) {
        return Promise.resolve();
      }
      // Cast to Promise<void> to satisfy type checker
      return document.fonts.ready.then(() => undefined);
    });
  } catch {
    // If fonts API fails, continue anyway
  }
}

/**
 * Wait for animations to complete
 * Waits for CSS animations and transitions to finish
 */
export async function waitForAnimations(page: Page, maxWait = 1000): Promise<void> {
  await page.evaluate((timeout) => {
    return new Promise((resolve) => {
      const startTime = Date.now();
      
      const checkAnimations = () => {
        const elements = document.querySelectorAll('*');
        let hasAnimations = false;
        
        for (const element of Array.from(elements)) {
          const computed = window.getComputedStyle(element);
          const animationName = computed.getPropertyValue('animation-name');
          const transitionDuration = computed.getPropertyValue('transition-duration');
          
          if (animationName !== 'none' || parseFloat(transitionDuration) > 0) {
            hasAnimations = true;
            break;
          }
        }
        
        if (!hasAnimations || Date.now() - startTime >= timeout) {
          resolve(undefined);
        } else {
          requestAnimationFrame(checkAnimations);
        }
      };
      
      requestAnimationFrame(checkAnimations);
    });
  }, maxWait);
}

/**
 * Wait for a modal/dialog to be fully visible and ready
 */
export async function waitForModal(page: Page): Promise<void> {
  // Wait for dialog to appear
  await page.waitForSelector('[role="dialog"]', { 
    state: 'visible',
    timeout: 5000 
  });
  
  // Wait for dialog to be fully rendered (backdrop, content, etc.)
  await page.waitForFunction(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return false;
    
    const rect = dialog.getBoundingClientRect();
    // Check if dialog has dimensions and is visible
    return rect.width > 0 && rect.height > 0;
  }, { timeout: 2000 });
  
  // Wait for animation frame
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
}

/**
 * Wait for an accordion section to expand/collapse
 */
export async function waitForAccordionTransition(page: Page): Promise<void> {
  // Wait for accordion animation to complete
  await page.waitForFunction(() => {
    const accordionContent = document.querySelector('[data-state="open"]');
    if (!accordionContent) return true;
    
    const computed = window.getComputedStyle(accordionContent);
    const transitionDuration = computed.getPropertyValue('transition-duration');
    
    // If no transition, we're done
    return transitionDuration === '0s' || transitionDuration === '';
  }, { timeout: 2000 }).catch(() => {
    // If timeout, animation might be done or doesn't exist
  });
  
  // Wait for animation frame
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
}

/**
 * Smart wait that combines multiple wait strategies
 * This replaces the generic waitForTimeout(500) pattern
 */
export async function smartWait(page: Page, options?: {
  charts?: boolean;
  images?: boolean;
  fonts?: boolean;
  animations?: boolean;
}): Promise<void> {
  const {
    charts = false,
    images = true,
    fonts = true,
    animations = false,
  } = options || {};
  
  const promises: Promise<void>[] = [];
  
  if (images) {
    promises.push(waitForImagesToLoad(page));
  }
  
  if (fonts) {
    promises.push(waitForFontsToLoad(page));
  }
  
  if (charts) {
    promises.push(waitForChartsToRender(page));
  }
  
  if (animations) {
    promises.push(waitForAnimations(page));
  }
  
  await Promise.all(promises);
  
  // Final animation frame to ensure everything is painted
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
}
