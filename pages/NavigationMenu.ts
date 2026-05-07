import { expect, Page, Locator } from "@playwright/test";

export class NavigationMenu {
  readonly page: Page;
  readonly membershipLink: Locator;
  readonly bookLink: Locator;
  readonly myClassesLink: Locator;
  readonly shopLink: Locator;
  readonly profileLink: Locator;
  readonly classCreditsLink: Locator;
  readonly paymentsLink: Locator;
  readonly studioEtiquetteLink: Locator;
  readonly notificationsLink: Locator;
  readonly helpSupportLink: Locator;
  readonly logoutLink: Locator;
  readonly userMenuButton: Locator;
  readonly logoutMenuItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.membershipLink = page.getByRole('link', { name: 'Membership' });
    this.bookLink = page.getByRole('link', { name: 'Book' });
    this.myClassesLink = page.getByRole('link', { name: 'My Classes' });
    this.shopLink = page.getByRole('link', { name: 'Shop' });
    this.profileLink = page.getByRole('link', { name: 'Profile' });
    this.classCreditsLink = page.getByRole('link', { name: 'Class Credits', exact: true });
    this.paymentsLink = page.getByRole('link', { name: 'Payments' });
    this.studioEtiquetteLink = page.getByRole('link', { name: 'Studio Etiquette' });
    this.notificationsLink = page.getByRole('link', { name: 'Notifications' });
    this.helpSupportLink = page.getByRole('link', { name: 'Help & Support Answers here' });
    this.logoutLink = page.getByText('Logout').nth(1);
    this.userMenuButton = page.locator('[aria-haspopup="menu"]');
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
  }

  async openMembership() {
    await this.membershipLink.click();
    await expect(this.page).toHaveURL('https://app.prontopilates.com/membership');
  }

  async openBook() {
    await this.bookLink.click();
    await expect(this.page).toHaveURL('https://app.prontopilates.com/book');
  }

  async openMyClasses() {
    await this.myClassesLink.click();
    await expect(this.page).toHaveURL('https://app.prontopilates.com/my-classes');
  }

  async openShop() {
    await this.shopLink.click();
    await expect(this.page).toHaveURL('https://app.prontopilates.com/shop');
  }

  async openProfile() {
    await this.profileLink.click();
    await expect(this.page).toHaveURL('https://app.prontopilates.com/profile');
  }

  async openClassCredits() {
    await this.classCreditsLink.click();
    await expect(this.page).toHaveURL('https://app.prontopilates.com/credits');
  }

  async openPayments() {
    await this.paymentsLink.click();
    await expect(this.page).toHaveURL('https://app.prontopilates.com/payments');
  }

  async openStudioEtiquette() {
    await this.studioEtiquetteLink.click();
    await expect(this.page).toHaveURL('https://app.prontopilates.com/studio-etiquette');
  }

  async openNotifications() {
    await this.notificationsLink.click();
    await expect(this.page).toHaveURL('https://app.prontopilates.com/notifications');
  }

  async openHelpSupport() {
    await this.helpSupportLink.click();
  }

  async logoutFromMenu() {
    await this.logoutLink.click();
    await expect(this.page).toHaveURL('https://app.prontopilates.com/login');
  }

  async logoutFromProfileMenu() {
    await this.userMenuButton.click();
    await this.logoutMenuItem.click();
    await expect(this.page).toHaveURL('https://app.prontopilates.com/login');
  }
}
