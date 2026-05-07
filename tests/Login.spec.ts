import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

// Login test
test("Login - Positive", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("muhammad.sqaexpert@gmail.com", "Test@1234567!");
  await loginPage.expectOnDashboard();
});

// Invalid credentials - Incorrect Email
test("Login - Invalid credentials (Incorrect Email)", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("muhammad.sqa8@gmail.co", "Test@1234567!");
  await expect(loginPage.invalidEmailError).toBeVisible();
});

// Invalid credentials - Incorrect Password
test("Login - Invalid credentials (Incorrect Password)", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("muhammad.sqaexpert@gmail.com", "WrongPassword123!");
  await expect(loginPage.invalidPasswordError).toBeVisible();
});

// Empty fields 
test("Login - Validation for empty fields", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await loginPage.emailInput.fill("");
  await loginPage.passwordInput.fill("Test@1234567!");
  await loginPage.loginButton.click();
  await expect(loginPage.emailRequiredError).toBeVisible();

  await page.reload();

  await loginPage.emailInput.fill("muhammad.sqaexpert@gmail.com");
  await loginPage.passwordInput.fill("");
  await loginPage.loginButton.click();
  await expect(loginPage.passwordRequiredError).toBeVisible();
});
