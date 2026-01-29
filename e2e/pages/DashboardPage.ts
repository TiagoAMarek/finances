import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, SELECTORS } from '../config/constants';
import { waitForModal, waitForAccordionTransition } from '../utils/smart-wait';

/**
 * Dashboard Page Object
 * Encapsulates all interactions with the dashboard page
 */
export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to dashboard
   */
  async goto(): Promise<void> {
    await super.goto(ROUTES.DASHBOARD);
    await this.waitForLoad({ charts: true });
  }

  /**
   * Open the create transaction modal
   */
  async openCreateTransactionModal(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    const createButton = this.page.locator(SELECTORS.CREATE_TRANSACTION_BTN).first();
    await createButton.waitFor({ state: 'visible', timeout: 10000 });
    await createButton.click();
    await waitForModal(this.page);
  }

  /**
   * Expand the resources accordion
   */
  async expandResourcesAccordion(): Promise<void> {
    const resourcesButton = this.page.getByRole('button', { name: /recursos/i });
    if (await resourcesButton.isVisible()) {
      await resourcesButton.click();
      await waitForAccordionTransition(this.page);
    }
  }

  /**
   * Check if resources accordion is expanded
   */
  async isResourcesExpanded(): Promise<boolean> {
    const accordion = this.page.locator('[data-state="open"]');
    return await accordion.count() > 0;
  }

  /**
   * Take snapshot of default dashboard state
   */
  async snapshotDefault(name: string = 'dashboard-default'): Promise<void> {
    await this.prepareForVisual();
    await this.takeSnapshot(name);
  }

  /**
   * Take snapshot with modal open
   */
  async snapshotWithModal(name: string = 'dashboard-with-modal'): Promise<void> {
    await this.openCreateTransactionModal();
    await this.prepareForVisual();
    await this.takeSnapshot(name);
  }

  /**
   * Take snapshot with resources expanded
   */
  async snapshotWithResourcesExpanded(name: string = 'dashboard-resources-expanded'): Promise<void> {
    await this.expandResourcesAccordion();
    await this.prepareForVisual();
    await this.takeSnapshot(name);
  }

  /**
   * Get locators for dashboard components (for component-level screenshots)
   */
  get components() {
    return {
      summaryCards: '[data-testid="summary-cards"]',
      charts: '.recharts-wrapper',
      resourcesSection: '[data-testid="resources-section"]',
      reportsSection: '[data-testid="reports-section"]',
    };
  }

  /**
   * Take component-level screenshots of all main sections
   */
  async snapshotComponents(prefix: string = 'dashboard'): Promise<void> {
    await this.prepareForVisual();
    
    // Take snapshots in parallel for speed
    const componentPromises = Object.entries(this.components)
      .filter(async ([_, selector]) => await this.page.locator(selector).count() > 0)
      .map(([name, selector]) => 
        this.takeComponentSnapshot(selector, `${prefix}-${name}`)
      );
    
    await Promise.all(componentPromises);
  }
}
