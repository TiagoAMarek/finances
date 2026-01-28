import { Page } from '@playwright/test';
import { waitForPageLoad } from '../utils/auth';
import { preparePageForVisualTest, takeVisualSnapshot, takeComponentSnapshot } from '../utils/visual';
import { ROUTES, SELECTORS } from '../config/constants';

/**
 * Base Page Object
 * Provides common functionality for all page objects
 */
export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to a specific route
   */
  async goto(route: string): Promise<void> {
    await this.page.goto(route);
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForLoad(options?: { charts?: boolean }): Promise<void> {
    await waitForPageLoad(this.page, options);
  }

  /**
   * Prepare page for visual testing
   */
  async prepareForVisual(): Promise<void> {
    await preparePageForVisualTest(this.page);
  }

  /**
   * Take a full page snapshot
   */
  async takeSnapshot(name: string): Promise<void> {
    await takeVisualSnapshot(this.page, { name, fullPage: true });
  }

  /**
   * Take a component snapshot
   */
  async takeComponentSnapshot(selector: string, name: string): Promise<void> {
    await takeComponentSnapshot(this.page, selector, name);
  }

  /**
   * Complete flow: navigate, prepare, and snapshot
   */
  async gotoAndSnapshot(route: string, name: string, options?: { charts?: boolean }): Promise<void> {
    await this.goto(route);
    await this.waitForLoad(options);
    await this.prepareForVisual();
    await this.takeSnapshot(name);
  }
}
