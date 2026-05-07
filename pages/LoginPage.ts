import { expect, Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly invalidEmailError: Locator;
  readonly invalidPasswordError: Locator;
  readonly emailRequiredError: Locator;
  readonly passwordRequiredError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator("input[id='email']");
    this.passwordInput = page.getByPlaceholder("Password");
    this.loginButton = page.locator("//input[@value='Login']");
    this.forgotPasswordLink = page.locator("text=Forgot Password?");
    this.invalidEmailError = page.locator('text="No account exists with this email address."');
    this.invalidPasswordError = page.locator('text="Password is incorrect!"');
    this.emailRequiredError = page.locator('text="Email is required."');
    this.passwordRequiredError = page.locator('text="Password is required."');
  }

  async goto() {
    await this.page.goto("https://app.prontopilates.com/login");
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email); 
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectOnDashboard() {
    await expect(this.page).toHaveURL("https://app.prontopilates.com/dashboard");
  }

  async expectOnLoginPage() {
    await expect(this.page).toHaveURL("https://app.prontopilates.com/login");
  }
}
