import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES } from '../config/constants';
import { smartWait } from '../utils/smart-wait';

/**
 * Accounts Page Object
 */
export class AccountsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto(ROUTES.ACCOUNTS);
    await this.waitForLoad();
  }
}

/**
 * Credit Cards Page Object
 */
export class CreditCardsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto(ROUTES.CREDIT_CARDS);
    await this.waitForLoad();
  }
}

/**
 * Transactions Page Object
 */
export class TransactionsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto(ROUTES.TRANSACTIONS);
    await this.waitForLoad();
  }

  /**
   * Open filters panel (if exists)
   */
  async openFilters(): Promise<void> {
    const filtersButton = this.page.getByRole('button', { name: /filtros/i });
    if (await filtersButton.isVisible()) {
      await filtersButton.click();
      await smartWait(this.page);
    }
  }
}

/**
 * Categories Page Object
 */
export class CategoriesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await super.goto(ROUTES.CATEGORIES);
    await this.waitForLoad();
  }

  /**
   * Switch to expense tab
   */
  async switchToExpenseTab(): Promise<void> {
    const expenseTab = this.page.getByRole('tab', { name: /despesa/i });
    if (await expenseTab.isVisible()) {
      await expenseTab.click();
      await smartWait(this.page);
    }
  }

  /**
   * Switch to income tab
   */
  async switchToIncomeTab(): Promise<void> {
    const incomeTab = this.page.getByRole('tab', { name: /receita/i });
    if (await incomeTab.isVisible()) {
      await incomeTab.click();
      await smartWait(this.page);
    }
  }

  /**
   * Take snapshot with specific tab
   */
  async snapshotWithTab(tabType: 'expense' | 'income', name?: string): Promise<void> {
    if (tabType === 'expense') {
      await this.switchToExpenseTab();
    } else {
      await this.switchToIncomeTab();
    }
    
    await this.prepareForVisual();
    await this.takeSnapshot(name || `categories-${tabType}-tab`);
  }
}
