import { expect, Page, Locator } from "@playwright/test";

export class BookingPage {
  readonly page: Page;
  readonly bookNowButtons: Locator;
  readonly confirmButton: Locator;
  readonly useNonExpiryCreditButton: Locator;
  readonly bookingSuccessMessage: Locator;
  readonly studioPickerButton: Locator;
  readonly studioSummary: Locator;
  readonly classCard: Locator;
  readonly calendarToggleButton: Locator;
  readonly calendarDialog: Locator;
  readonly calendarTodayButton: Locator;
  readonly weekNextButton: Locator;
  readonly weekpreviousButton: Locator;
  readonly selectedButton: Locator;
  readonly weekDayValues: Locator;
  readonly selectedWeekDay: Locator;
  readonly filterButton: Locator;
  readonly filtersModal: Locator;
  readonly applyFiltersButton: Locator;
  readonly clearFiltersButton: Locator;
  readonly filterOption: (name: string) => Locator;
  readonly classTypeLabels: Locator;
  readonly allButtons: Locator;
  readonly backButton: Locator;
  readonly classCards: Locator;
  readonly classCardWrapper: Locator;
  readonly classCardTimeLabel: (card: Locator) => Locator;
  readonly bookNowButtonInCard: (card: Locator) => Locator;
  readonly joinWaitlistButtonInCard: (card: Locator) => Locator;
  readonly studioDisplayByName: (name: string) => Locator;
  readonly studioMenu: Locator;
  readonly studioMenuItem: (name: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.bookNowButtons = page.getByRole('button', { name: 'Book Now' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm' });
    this.useNonExpiryCreditButton = page.getByRole('button', { name: 'Use Non-Expiry Credit' });
    this.bookingSuccessMessage = page.locator('text=You are booked into this class!');
    this.studioPickerButton = page.locator('button[aria-haspopup="menu"]');
    this.studioSummary = this.studioPickerButton.locator('div.flex.items-center.justify-between.gap-1');
    this.classCard = page.locator('div.relative.border-athens-gray-200');
    this.calendarToggleButton = page.getByRole('button', { name: 'Open Calendar' });
    this.calendarDialog = page.locator('div.react-datepicker');
    this.calendarTodayButton = page.getByText('Today');
    this.weekNextButton = page.getByRole('button').filter({ hasText: /^$/ }).nth(1);
    this.weekpreviousButton = page.getByRole('button').filter({ hasText: /^$/ }).first();
    this.selectedButton = page.locator('button.bg-pomegranate-100\\/60');

    
    this.weekDayValues = page.locator('div.mt-4.inline-flex button span.font-bold');
    this.selectedWeekDay = page.locator('div.mt-4.inline-flex button[class*="bg-pomegranate-100"] span.font-bold').first();
    this.filterButton = page.getByRole('button', { name: 'Filters' });
    this.filtersModal = page.locator('div[id^="headlessui-dialog-panel"]');
    this.applyFiltersButton = page.getByRole('button', { name: 'Apply Now' });
    this.clearFiltersButton = page.getByRole('button', { name: 'Clear' });
    this.filterOption = (name: string) => page.getByRole('option', { name });
    this.classTypeLabels = page.locator('div.text-base.font-bold.capitalize.text-black');
    this.allButtons = page.locator('button');
    this.backButton = page.getByRole('button', { name: 'Back' });
    this.classCards = page.locator('.border-gray-300');
    this.classCardWrapper = page.locator('.my-2.flex.flex-col.items-center.self-stretch');
    this.classCardTimeLabel = (card: Locator) => card.locator('.text-base.font-bold.text-black > span').first();
    this.bookNowButtonInCard = (card: Locator) => card.locator('button:has-text("Book Now")');
    this.joinWaitlistButtonInCard = (card: Locator) => card.locator('button:has-text("Join Waitlist")');
    this.studioDisplayByName = (name: string) => page.locator('div', { hasText: new RegExp(`^${name}$`, 'i') });
    this.studioMenu = page.locator("//div[@role='none']");
    this.studioMenuItem = (name: string) => page.getByRole('menuitem', { name });
  }

  async goto() {
    await this.page.goto('https://app.prontopilates.com/book');
  }

  async getStudioName(): Promise<string | null> {
    await expect(this.studioSummary).toBeVisible();
    return (await this.studioSummary.textContent())?.trim() ?? null;
  }

  async confirmBooking() {
    if (await this.confirmButton.first().isVisible()) {
      await this.confirmButton.first().click();
    } else if (await this.useNonExpiryCreditButton.first().isVisible()) {
      await this.useNonExpiryCreditButton.first().click();
    }
    await expect(this.bookingSuccessMessage).toBeVisible();
  }

  async bookClassFromList() {
    await this.bookNowButtons.last().click();
    await this.bookNowButtons.first().click();
    await this.confirmBooking();
  }

  async extractBookedCardDetails(): Promise<{ classType: string; date: string; time: string; level: string }> {
    const card = this.classCard.first();

    const getText = async (locatorStr: string): Promise<string> => {
      const locator = card.locator(locatorStr).first();
      await expect(locator).toBeVisible({ timeout: 3000 });
      return (await locator.textContent())?.trim() ?? "";
    };

    return {
      classType: await getText('div:has(+ div[class*="bg-slate-950"])'),
      date: await getText('div.flex:has(svg path[d*="M19,8H5V19H9.67"]) > p'),
      time: await getText('div.flex:has(svg path[d*="M12 20C16.4 20"]) > p'),
      level: await getText('div.flex:has(svg path[d*="M3,22V8H7V22H3"]) > p'),
    };
  }
}
