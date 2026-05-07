import { expect, test } from "@playwright/test";
import fs from "fs";
import { LoginPage } from "../pages/LoginPage";
import { NavigationMenu } from "../pages/NavigationMenu";

const content = JSON.parse(fs.readFileSync("data.json", "utf-8"));


test.describe("Side Menu", () => {
  test("should load login page", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const navigationMenu = new NavigationMenu(page);

    await loginPage.goto();
    await loginPage.login("muhammad.sqaexpert@gmail.com", "Test@1234567!");
    await loginPage.expectOnDashboard();

    await navigationMenu.openMembership();
    await navigationMenu.openBook();
    await navigationMenu.openMyClasses();
    await navigationMenu.openShop();
    await navigationMenu.openProfile();
    await navigationMenu.openClassCredits();
    await navigationMenu.openPayments();
    await navigationMenu.openStudioEtiquette();
    await navigationMenu.openNotifications();
    await navigationMenu.openHelpSupport();

    await navigationMenu.logoutLink.click();
    await loginPage.expectOnLoginPage();

    await loginPage.login("muhammad.sqaexpert@gmail.com", "Test@1234567!");
    await loginPage.expectOnDashboard();

    await navigationMenu.logoutFromProfileMenu();
  });
});
