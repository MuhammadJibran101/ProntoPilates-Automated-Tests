import { expect, Page, Locator } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly dashboardTitle: Locator;
  readonly greetingName: Locator;
  readonly greatToSeeMessage: Locator;
  readonly upcomingClassesTitle: Locator;
  readonly noClassesMessage: Locator;
  readonly bookClassesButton: Locator;
  readonly allClassesButton: Locator;
  readonly manageMembershipLink: Locator;
  readonly bookedClassesCard: Locator;
  readonly bookedClassTimeDate: Locator;
  readonly bookedClassTitle: Locator;
  readonly bookedClassDetails: Locator;
  readonly medalBackground: Locator;
  readonly planDetailsHeading: Locator;
  readonly planDetailsBanner: Locator;
  readonly planName: Locator;
  readonly planStudio: Locator;
  readonly planAccountEmail: Locator;
  readonly planNextPayment: Locator;
  readonly planCouponApplied: Locator;
  readonly medalImage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardTitle = page.locator('h1:text-is("Dashboard")');
    this.greetingName = page.locator('div[class*="truncate"] p.font-semibold');
    this.greatToSeeMessage = page.locator('text=Great to see you here!');
    this.upcomingClassesTitle = page.locator('text=Upcoming Classes');
    this.noClassesMessage = page.locator('text=No classes on your schedule.');
    this.bookClassesButton = page.getByRole('button', { name: 'Book Classes' });
    this.allClassesButton = page.getByRole('button', { name: 'All classes' });
    this.manageMembershipLink = page.getByRole('link', { name: 'Manage Membership' });
    this.bookedClassesCard = page.locator('div.flex.items-start.gap-4');
    this.bookedClassTimeDate = page.locator('div.flex.items-start.gap-4 >> div.font-semibold').first();
    this.bookedClassTitle = page.locator('div.flex.items-start.gap-4 >> div.text-lg.font-semibold');
    this.bookedClassDetails = page.locator('div.flex.items-start.gap-4 >> div.text-xs.text-gray-400');
    this.medalBackground = page.locator('div[style*="background-image"]');
    this.planDetailsHeading = page.getByRole('heading', { name: 'Here are your plan details' });
    this.planDetailsBanner = page.getByRole('heading', { name: 'Plan Details Active' });
    this.planName = page.getByText('Enthusiast Plan');
    this.planStudio = page.getByText('Home Studio');
    this.planAccountEmail = page.getByText('Account email');
    this.planNextPayment = page.getByText('Next Payment');
    this.planCouponApplied = page.getByText('Coupon Applied');
    this.medalImage = page.getByRole('img', { name: 'Medal Image' });
  }

  greetingFor(firstName: string): Locator {
    return this.page.locator(`text=Hi ${firstName},`);
  }

  async waitForLoad() {
    await expect(this.page).toHaveURL('https://app.prontopilates.com/dashboard');
    await this.page.waitForLoadState('load');
  }

  async navigateToAllClassesIfAvailable() {
    if (await this.noClassesMessage.isHidden()) {
      await expect(this.allClassesButton).toBeVisible();
      await this.allClassesButton.click();
    }
  }
}
