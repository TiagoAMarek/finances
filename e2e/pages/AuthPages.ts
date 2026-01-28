import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { ROUTES, SELECTORS } from '../config/constants';
import { smartWait } from '../utils/smart-wait';

/**
 * Login Page Object
 * Encapsulates all interactions with the login page
 */
export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await super.goto(ROUTES.LOGIN);
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string): Promise<void> {
    await this.page.fill(SELECTORS.EMAIL_INPUT, email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.page.fill(SELECTORS.PASSWORD_INPUT, password);
  }

  /**
   * Click submit button
   */
  async submit(): Promise<void> {
    await this.page.click(SELECTORS.SUBMIT_BTN);
  }

  /**
   * Complete login flow
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  /**
   * Trigger validation errors by submitting empty form
   */
  async triggerValidationErrors(): Promise<void> {
    await this.submit();
    await smartWait(this.page);
  }

  /**
   * Fill form with test data
   */
  async fillTestForm(): Promise<void> {
    await this.fillEmail('test@example.com');
    await this.fillPassword('password123');
  }

  /**
   * Get form locators
   */
  get form() {
    return {
      email: this.page.locator(SELECTORS.EMAIL_INPUT),
      password: this.page.locator(SELECTORS.PASSWORD_INPUT),
      submit: this.page.locator(SELECTORS.SUBMIT_BTN),
    };
  }

  /**
   * Check if validation errors are visible
   */
  async hasValidationErrors(): Promise<boolean> {
    const errorMessages = this.page.locator('[role="alert"], .text-destructive');
    return await errorMessages.count() > 0;
  }
}

/**
 * Register Page Object
 * Encapsulates all interactions with the register page
 */
export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to register page
   */
  async goto(): Promise<void> {
    await super.goto(ROUTES.REGISTER);
  }

  /**
   * Fill name field
   */
  async fillName(name: string): Promise<void> {
    await this.page.fill('input[name="name"]', name);
  }

  /**
   * Fill email field
   */
  async fillEmail(email: string): Promise<void> {
    await this.page.fill(SELECTORS.EMAIL_INPUT, email);
  }

  /**
   * Fill password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.page.fill('input[name="password"]', password);
  }

  /**
   * Click submit button
   */
  async submit(): Promise<void> {
    await this.page.click(SELECTORS.SUBMIT_BTN);
  }

  /**
   * Complete registration flow
   */
  async register(name: string, email: string, password: string): Promise<void> {
    await this.fillName(name);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  /**
   * Trigger validation errors by touching and clearing fields
   */
  async triggerValidationErrors(): Promise<void> {
    await this.fillName('a');
    await this.fillName('');
    await this.fillEmail('invalid');
    await this.fillEmail('');
    await this.fillPassword('short');
    await this.fillPassword('');
    await smartWait(this.page);
  }

  /**
   * Fill form with test data
   */
  async fillTestForm(): Promise<void> {
    await this.fillName('Test User');
    await this.fillEmail('test@example.com');
    await this.fillPassword('password123');
  }

  /**
   * Get form locators
   */
  get form() {
    return {
      name: this.page.locator('input[name="name"]'),
      email: this.page.locator(SELECTORS.EMAIL_INPUT),
      password: this.page.locator('input[name="password"]'),
      submit: this.page.locator(SELECTORS.SUBMIT_BTN),
    };
  }

  /**
   * Check if validation errors are visible
   */
  async hasValidationErrors(): Promise<boolean> {
    const errorMessages = this.page.locator('[role="alert"], .text-destructive');
    return await errorMessages.count() > 0;
  }
}
