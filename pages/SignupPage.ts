import { expect, Page, Locator } from "@playwright/test";

export class SignupPage {
  readonly page: Page;
  // Landing/select studio tab
  readonly selectStateButton: Locator;
  readonly stateDropdown: Locator;
  readonly studioDropdown: Locator;
  readonly mediaDropdown: Locator;
  readonly listboxOptions: Locator;
  readonly nextButton: Locator;
  readonly applyCouponButton: Locator;
  readonly couponInput: Locator;
  readonly couponAppliedToast: Locator;
  readonly couponErrorToast: Locator;
  readonly couponTag: (code: string) => Locator;
  readonly discountBanner: Locator;
  readonly priceAmount: Locator;
  readonly priceStrikethrough: Locator;
  // Personal details tab
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordConfirmInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly termsCheckbox: Locator;
  readonly marketingEmailCheckbox: Locator;
  readonly marketingSmsCheckbox: Locator;
  // Add-on radio buttons
  readonly allAccessYesRadio: Locator;
  readonly allAccessNoRadio: Locator;
  readonly allAccessYesLabel: Locator;
  readonly allAccessNoLabel: Locator;
  readonly allAccessSection: Locator;
  readonly allAccessContent: Locator;
  // Payment tab
  readonly cardNumberInput: Locator;
  readonly cardExpiryInput: Locator;
  readonly cardCvvInput: Locator;
  readonly submitButton: Locator;
  readonly alertMessage: Locator;
  // Misc selectors
  readonly nextPaymentText: Locator;
  readonly casualPlanCta: Locator;
  readonly casualPlanHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    // Landing/select studio tab
    this.selectStateButton = page.locator('text=Select State');
    this.stateDropdown = page.locator('#headlessui-listbox-button-\\:r5\\:');
    this.studioDropdown = page.locator('#headlessui-listbox-button-\\:r6\\:');
    this.mediaDropdown = page.locator('#headlessui-listbox-button-\\:r7\\:');
    this.listboxOptions = page.locator('ul[role="listbox"] li[role="option"]');
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.applyCouponButton = page.getByRole('button', { name: 'Apply' });
    this.couponInput = page.getByPlaceholder('Enter Code');
    this.couponAppliedToast = page.locator('text=Coupon is Applied');
    this.couponErrorToast = page.locator('text=Cannot GET /coupon/');
    this.couponTag = (code: string) => page.locator(`div.bg-green-500 >> div:text-is("Coupon: ${code}")`);
    this.discountBanner = page.locator('text=100% discount forever');
    this.priceAmount = page.locator('text=$34.5');
    this.priceStrikethrough = page.locator('span.line-through:has-text("$69")');
    // Personal details tab
    this.firstNameInput = page.locator("input[id='first_name']");
    this.lastNameInput = page.locator("input[id='last_name']");
    this.phoneInput = page.locator("input[type='tel']");
    this.emailInput = page.locator("input[id='email']");
    this.passwordInput = page.locator("input[id='password']");
    this.passwordConfirmInput = page.locator("input[id='passwordConfirm']");
    this.dateOfBirthInput = page.locator("input[id='dob']");
    this.termsCheckbox = page.locator("input[id='t_and_c']");
    this.marketingEmailCheckbox = page.locator("input[id='marketing_email']");
    this.marketingSmsCheckbox = page.locator("input[id='marketing_sms']");
    // Add-on radio buttons
    this.allAccessYesRadio = page.locator("//input[@id='yes']");
    this.allAccessNoRadio = page.locator("//input[@id='no']");
    this.allAccessYesLabel = page.locator("label[for='yes']");
    this.allAccessNoLabel = page.locator("label[for='no']");
    this.allAccessSection = page.locator("//div[normalize-space()='All-Access Add-on:']");
    this.allAccessContent = page.locator('body > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)');
    // Payment tab
    this.cardNumberInput = page.locator('#card_number');
    this.cardExpiryInput = page.locator("input[id='card_expiry']");
    this.cardCvvInput = page.locator("input[id='card_cvv']");
    this.submitButton = page.locator("button[type='submit']");
    this.alertMessage = page.locator("div[role='alert']");
    // Misc selectors
    this.nextPaymentText = page.locator('div.w-4\\/5 > div.text-xs');
    this.casualPlanCta = page.locator("(//a[@id='price-cta'])[1]");
    this.casualPlanHeader = page.locator('text="Casual Plan"');
  }

  async gotoPricing() {
    await this.page.goto('https://www.prontopilates.com.au/prices/');
  }

  async gotoSignup() {
    await this.page.goto('https://app.prontopilates.com/signup?chargebee_id=Casual-Plan-AUD-Monthly&landing_url=/prices/');
  }

  optionByText(text: string): Locator {
    return this.page.locator(`text=${text}`);
  }

  async selectState(state: string) {
    await this.selectStateButton.click();
    await this.optionByText(state).click();
  }

  async selectStudio(studio: string) {
    await this.studioDropdown.click();
    await this.optionByText(studio).click();
  }

  async selectMedia(option: string) {
    await this.mediaDropdown.click();
    await this.optionByText(option).click();
  }

  async applyCoupon(code: string) {
    await this.couponInput.fill(code);
    await this.applyCouponButton.click();
  }

  async fillPersonalDetails({ firstName, lastName, phone, email, password, confirmPassword, dob, subscribeEmail = true, subscribeSms = false }: { firstName?: string; lastName?: string; phone?: string; email?: string; password?: string; confirmPassword?: string; dob?: string; subscribeEmail?: boolean; subscribeSms?: boolean }) {
    await this.firstNameInput.fill(firstName ?? '');
    await this.lastNameInput.fill(lastName ?? '');
    await this.phoneInput.fill(phone ?? '');
    await this.emailInput.fill(email ?? '');
    await this.passwordInput.fill(password ?? '');
    await this.passwordConfirmInput.fill(confirmPassword ?? '');
    await this.dateOfBirthInput.fill(dob ?? '');

    if (subscribeEmail) {
      if (!(await this.marketingEmailCheckbox.isChecked())) {
        await this.marketingEmailCheckbox.click();
      }
    } else if (await this.marketingEmailCheckbox.isChecked()) {
      await this.marketingEmailCheckbox.click();
    }

    if (subscribeSms) {
      if (!(await this.marketingSmsCheckbox.isChecked())) {
        await this.marketingSmsCheckbox.click();
      }
    } else if (await this.marketingSmsCheckbox.isChecked()) {
      await this.marketingSmsCheckbox.click();
    }
  }

  async acceptTerms() {
    if (!(await this.termsCheckbox.isChecked())) {
      await this.termsCheckbox.click();
    }
  }

  async fillPaymentDetails({ cardNumber, expiry, cvv }: { cardNumber?: string; expiry?: string; cvv?: string }) {
    await this.cardNumberInput.fill(cardNumber ?? '');
    await this.cardExpiryInput.fill(expiry ?? '');
    await this.cardCvvInput.fill(cvv ?? '');
  }
}
