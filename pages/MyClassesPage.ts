import { expect, Page, Locator } from "@playwright/test";

export class MyClassesPage {
  readonly page: Page;
  readonly bookingsTabButton: Locator;
  readonly cancelBookingButton: Locator;
  readonly cancelClassConfirmButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bookingsTabButton = page.getByLabel('Bookings').getByRole('button');
    this.cancelBookingButton = page.getByRole('button', { name: 'Cancel Booking' });
    this.cancelClassConfirmButton = page.getByRole('button', { name: 'Cancel Class' });
  }

  async goto() {
    await this.page.goto('https://app.prontopilates.com/my-classes');
  }

  async cancelLatestBooking() {
    await this.bookingsTabButton.click();
    const cancelButtons = await this.cancelBookingButton.count();

    if (cancelButtons === 0) {
      return;
    }

    await this.cancelBookingButton.first().click();
    await this.cancelClassConfirmButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
