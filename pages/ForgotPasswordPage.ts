import { expect, Page, Locator } from "@playwright/test";

export class ForgotPasswordPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly sendEmailButton: Locator;
  readonly invalidEmailError: Locator;
  readonly emailRequiredError: Locator;
  readonly backToLoginLink: Locator;
  readonly successIllustration: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByPlaceholder('Email');
    this.sendEmailButton = page.locator('text="Send Email"');
    this.invalidEmailError = page.locator('text="Failed to request password reset"');
    this.emailRequiredError = page.locator('text="Email is required."');
    this.backToLoginLink = page.locator('text="Back to Login"');
    this.successIllustration = page.getByAltText('Thumbs up');
  }

  async goto() {
    await this.page.goto('https://app.prontopilates.com/forgot-password');
  }

  async requestReset(email?: string) {
    if (email !== undefined) {
      await this.emailInput.fill(email);
    }
    await this.sendEmailButton.click();
  }

  async expectOnPage() {
    await expect(this.page).toHaveURL('https://app.prontopilates.com/forgot-password');
  }
}
