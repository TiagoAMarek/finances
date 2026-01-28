import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../config/constants';

/**
 * Performance Report Page Object
 */
export class PerformanceReportPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto(ROUTES.PERFORMANCE_REPORT);
    await this.waitForLoad({ charts: true });
  }

  /**
   * Take snapshot of report (charts included)
   */
  async snapshotReport(name: string = 'performance-report-default'): Promise<void> {
    await this.prepareForVisual();
    await this.takeSnapshot(name);
  }
}

/**
 * Expense Analysis Page Object
 */
export class ExpenseAnalysisPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto(ROUTES.EXPENSE_ANALYSIS);
    await this.waitForLoad({ charts: true });
  }

  /**
   * Take snapshot of report (charts included)
   */
  async snapshotReport(name: string = 'expense-analysis-default'): Promise<void> {
    await this.prepareForVisual();
    await this.takeSnapshot(name);
  }
}
