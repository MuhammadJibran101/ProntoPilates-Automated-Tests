import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";

test("Forgot Password - Navigate", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const forgotPasswordPage = new ForgotPasswordPage(page);

  await loginPage.goto();
  await loginPage.forgotPasswordLink.click();
  await forgotPasswordPage.expectOnPage();
});

// Forgot Password - Invalid Email
test("Forgot Password - Invalid Email", async ({ page }) => {
  const forgotPasswordPage = new ForgotPasswordPage(page);

  await forgotPasswordPage.goto();
  await forgotPasswordPage.requestReset("invalid-email");
  await expect(forgotPasswordPage.invalidEmailError).toBeVisible();
});

// Forgot Password - Valid Email
test("Forgot Password - Valid Email", async ({ page }) => {
  const forgotPasswordPage = new ForgotPasswordPage(page);

  await forgotPasswordPage.goto();
  await forgotPasswordPage.requestReset("muhammad.sqaexpert@gmail.com");
  await expect(forgotPasswordPage.successIllustration).toBeVisible();
});

// Forgot Password - Email is required
test("Forgot Password - Email is required", async ({ page }) => {
  const forgotPasswordPage = new ForgotPasswordPage(page);

  await forgotPasswordPage.goto();
  await forgotPasswordPage.requestReset("");
  await expect(forgotPasswordPage.emailRequiredError).toBeVisible();
});

// Forgot Password - Back to Login
test("Forgot Password - Back to Login", async ({ page }) => {
  const forgotPasswordPage = new ForgotPasswordPage(page);

  await forgotPasswordPage.goto();
  await forgotPasswordPage.backToLoginLink.click();
  await expect(page).toHaveURL("https://app.prontopilates.com/login");
});

// Forgot Password - Go Back
test("Forgot Password - Go Back", async ({ page }) => {
  const loginPage = new LoginPage(page);
  const forgotPasswordPage = new ForgotPasswordPage(page);

  await loginPage.goto();
  await loginPage.forgotPasswordLink.click();
  await forgotPasswordPage.backToLoginLink.click();
  await loginPage.expectOnLoginPage();
});
