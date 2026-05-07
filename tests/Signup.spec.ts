import { expect, test } from "@playwright/test";
import fs from "fs";
import { SignupPage } from "../pages/SignupPage";

const data = {
  Studio: "Henley Beach",
  Account_email: "ta085017238@gmail.com",
  Next_Payment: "$99 $0 on 21-06-2025",
  Coupon_Applied: "LEGACY-GRATIS",
};

fs.writeFileSync("data.json", JSON.stringify(data, null, 2));

const defaultSelectConfig = {
  state: "New South Wales",
  studio: "Manly",
  media: "Social Media",
  coupon: undefined,
};

const defaultPersonalDetails = {
  firstName: "Muhammad",
  lastName: "Test",
  phone: "+61321324325",
  email: "ta085320178@gmail.com",
  password: "Test@1234567!",
  confirmPassword: "Test@1234567!",
  dob: "12/27/1995",
  subscribeEmail: true,
  subscribeSms: true,
  acceptTerms: true,
};

async function openSignup(signupPage) {
  await signupPage.gotoSignup();
  await signupPage.page.waitForSelector("text=Select State", { state: "visible" });
}

async function configureSelectStudio(signupPage, overrides = {}) {
  const config = { ...defaultSelectConfig, ...overrides };

  if (config.state) {
    await signupPage.selectState(config.state);
  }

  if (config.studio) {
    await signupPage.selectStudio(config.studio);
  }

  if (config.media) {
    await signupPage.selectMedia(config.media);
  }

  if (config.coupon) {
    await signupPage.applyCoupon(config.coupon);
  }
}

async function goToPersonalDetails(signupPage, selectOverrides = {}) {
  await openSignup(signupPage);
  await configureSelectStudio(signupPage, selectOverrides);
  await signupPage.nextButton.click();
}

async function completePersonalDetails(signupPage, overrides = {}) {
  const details = { ...defaultPersonalDetails, ...overrides };
  await signupPage.fillPersonalDetails(details);

  if (details.acceptTerms) {
    await signupPage.acceptTerms();
  }
}

async function goToPayment(signupPage, selectOverrides = {}, personalOverrides = {}) {
  await goToPersonalDetails(signupPage, selectOverrides);
  await completePersonalDetails(signupPage, personalOverrides);
  await signupPage.nextButton.click();
}

test.describe("Signup - Select Studio Tab - Test Cases", () => {
  test("Casual Plan URL", async ({ page }) => {
    const signupPage = new SignupPage(page);

    await signupPage.gotoPricing();
    await expect(signupPage.casualPlanHeader).toBeVisible();
    await signupPage.casualPlanCta.click();
    await expect(page).toHaveURL(/chargebee_id=Casual-Plan-AUD-Monthly/);
  });

  test("Next button Disable", async ({ page }) => {
    const signupPage = new SignupPage(page);

    await openSignup(signupPage);

    const getTextWithRetry = async (locator) => {
      for (let i = 0; i < 5; i += 1) {
        const text = await locator.textContent();
        if (text && text.trim() !== "") {
          return text.trim();
        }
        await page.waitForTimeout(500);
      }
      return "";
    };

    const stateText = await getTextWithRetry(signupPage.stateDropdown);
    const studioText = await getTextWithRetry(signupPage.studioDropdown);
    const mediaText = await getTextWithRetry(signupPage.mediaDropdown);

    if (stateText === "Select State" || studioText === "Select Studio" || mediaText === "Please Select") {
      await expect(signupPage.nextButton).toBeDisabled();
    } else {
      await expect(signupPage.nextButton).toBeEnabled();
    }
  });

  test("Verify next payment date is correct", async ({ page }) => {
    const signupPage = new SignupPage(page);
    const nextPaymentDate = new Date();

    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    const formattedDate = `${nextPaymentDate.getDate().toString().padStart(2, "0")}-${nextPaymentDate.toLocaleString('default', { month: 'short' })}-${nextPaymentDate.getFullYear()}`;

    await openSignup(signupPage);
    const dateText = await signupPage.nextPaymentText.textContent();

    expect(dateText?.trim()).toBe(formattedDate);
  });

  test("Radio button selection", async ({ page }) => {
    const signupPage = new SignupPage(page);

    await openSignup(signupPage);

    await expect(signupPage.allAccessYesLabel).toBeVisible();
    if (await signupPage.allAccessYesRadio.isChecked()) {
      await expect(signupPage.allAccessContent).toBeVisible();
      await expect(signupPage.allAccessSection).toBeVisible();
    } else {
      await expect(signupPage.allAccessContent).toBeHidden();
      await expect(signupPage.allAccessSection).toBeHidden();
    }

    await expect(signupPage.allAccessNoLabel).toBeVisible();
    await signupPage.allAccessNoRadio.click();
    if (await signupPage.allAccessNoRadio.isChecked()) {
      await expect(signupPage.allAccessContent).toBeHidden();
      await expect(signupPage.allAccessSection).toBeHidden();
    }
  });

  test("Check All States", async ({ page }) => {
    const signupPage = new SignupPage(page);

    await openSignup(signupPage);
    await signupPage.selectStateButton.click();
    const optionsCount = await signupPage.listboxOptions.count();
    expect(optionsCount).toBe(6);
    await expect(signupPage.optionByText("New South Wales")).toBeVisible();
    await expect(signupPage.optionByText("Victoria")).toBeVisible();
    await expect(signupPage.optionByText("Queensland")).toBeVisible();
    await expect(signupPage.optionByText("Western Australia")).toBeVisible();
    await expect(signupPage.optionByText("South Australia")).toBeVisible();
    await expect(signupPage.optionByText("Tasmania")).toBeVisible();
  });

  test("Social Media Drop-downs", async ({ page }) => {
    const signupPage = new SignupPage(page);

    await openSignup(signupPage);
    await signupPage.mediaDropdown.click();

    const optionsCount = await signupPage.listboxOptions.count();
    expect(optionsCount).toBe(5);

    for (let i = 0; i < optionsCount; i += 1) {
      const optionText = await signupPage.listboxOptions.nth(i).innerText();
      expect(optionText?.trim()).not.toBe("");
    }
  });

  test("Discount Code button", async ({ page }) => {
    const signupPage = new SignupPage(page);

    await openSignup(signupPage);

    await signupPage.applyCouponButton.click();
    await expect(signupPage.couponErrorToast).toBeVisible();
    await signupPage.couponInput.fill("Test@1234567!");

    await signupPage.applyCoupon("MANLY50X2");
    await expect(signupPage.couponAppliedToast).toBeVisible();
    await expect(signupPage.couponTag("MANLY50X2")).toBeVisible();
    await expect(signupPage.priceAmount.nth(1)).toBeVisible();
    await expect(signupPage.priceAmount.nth(2)).toBeVisible();
    await expect(signupPage.priceStrikethrough).toBeVisible();

    await signupPage.applyCoupon("Legacy-Gratis");
    await expect(signupPage.couponAppliedToast).toBeVisible();
    await expect(signupPage.couponTag("LEGACY-GRATIS").nth(1)).toBeVisible();
  });
});

// Personal Details tab test suite
test.describe("Signup - Personal Details tab - Negative Test Cases", () => {
  test("Signup - Missing First Name", async ({ page }) => {
    const signupPage = new SignupPage(page);

    await goToPersonalDetails(signupPage);
    await signupPage.fillPersonalDetails({
      firstName: "",
      lastName: "Test",
      phone: "+61321324325",
      email: "Muhammadtest17",
      password: "Test@1234567!",
      confirmPassword: "Test@1234567!",
      dob: "12/27/1995",
      subscribeEmail: true,
      subscribeSms: true,
    });
    await signupPage.acceptTerms();
    await expect(signupPage.nextButton).toBeDisabled();
  });

  test("Signup - Missing Last Name", async ({ page }) => {
    const signupPage = new SignupPage(page);

    await goToPersonalDetails(signupPage);
    await signupPage.fillPersonalDetails({
      firstName: "Muhammad",
      lastName: "",
      phone: "+61321324325",
      email: "Muhammadtest17",
      password: "Test@1234567!",
      confirmPassword: "Test@1234567!",
      dob: "12/27/1995",
      subscribeEmail: true,
      subscribeSms: true,
    });
    await signupPage.acceptTerms();
    await expect(signupPage.nextButton).toBeDisabled();
  });

  test("Signup - Invalid Email Format", async ({ page }) => {
    const signupPage = new SignupPage(page);

    await goToPersonalDetails(signupPage);
    await signupPage.fillPersonalDetails({
      firstName: "Muhammad",
      lastName: "Test",
      phone: "+61321324325",
      email: "invalid-email",
      password: "Test@1234567!",
      confirmPassword: "Test@1234567!",
      dob: "12/27/1995",
      subscribeEmail: true,
      subscribeSms: true,
    });
    await signupPage.acceptTerms();
    await expect(signupPage.nextButton).toBeDisabled();
  });

  test("Signup - Passwords Do Not Match", async ({ page }) => {
    const signupPage = new SignupPage(page);

    await goToPersonalDetails(signupPage);
    await signupPage.fillPersonalDetails({
      firstName: "Muhammad",
      lastName: "Test",
      phone: "+61321324325",
      email: "Muhammadtest17",
      password: "Test@1234567!",
      confirmPassword: "DifferentPassword!",
      dob: "12/27/1995",
      subscribeEmail: true,
      subscribeSms: true,
    });
    await signupPage.acceptTerms();
    await expect(signupPage.nextButton).toBeDisabled();
  });

  test("Signup - Invalid Date of Birth", async ({ page }) => {
    const signupPage = new SignupPage(page);

    await goToPersonalDetails(signupPage);
    await signupPage.fillPersonalDetails({
      firstName: "Muhammad",
      lastName: "Test",
      phone: "+61321324325",
      email: "Muhammadtest17",
      password: "Test@1234567!",
      confirmPassword: "Test@1234567!",
      dob: "01/02/2022",
      subscribeEmail: true,
      subscribeSms: true,
    });
    await signupPage.acceptTerms();
    await expect(signupPage.nextButton).toBeDisabled();
  });

  test("Signup - Unchecked Terms and Conditions", async ({ page }) => {
    const signupPage = new SignupPage(page);

    await goToPersonalDetails(signupPage);
    await signupPage.fillPersonalDetails({
      firstName: "Muhammad",
      lastName: "Test",
      phone: "+61321324325",
      email: "Muhammadtest17",
      password: "Test@1234567!",
      confirmPassword: "Test@1234567!",
      dob: "12/27/1995",
      subscribeEmail: true,
      subscribeSms: true,
      acceptTerms: false,
    });
    await expect(signupPage.nextButton).toBeDisabled();
  });
});

// Easy Payment test suite
test.describe("Signup - Easy Payment Tab - Negative Test Cases", () => {
  test('Invalid Card Number', async ({ page }) => {
    const signupPage = new SignupPage(page);

    await page.context().clearCookies();
    await page.context().clearPermissions();
    await page.addInitScript(() => window.localStorage.clear());

    await goToPayment(signupPage, { coupon: "Legacy-Gratis" }, {
      email: "arslan.sqa215@gmail.com",
    });

    await signupPage.fillPaymentDetails({
      cardNumber: "1234567890123456",
      expiry: "08/28",
      cvv: "279",
    });
    await signupPage.submitButton.click();
    await expect(signupPage.alertMessage.first()).toBeVisible({ timeout: 5000 });
  });

  test('Missing Card Number', async ({ page }) => {
    const signupPage = new SignupPage(page);

    await goToPayment(signupPage, { coupon: "Legacy-Gratis" });
    await signupPage.fillPaymentDetails({
      expiry: "08/28",
      cvv: "279",
    });
    await expect(signupPage.submitButton).toBeDisabled();
  });

  test('Missing Expiry Date', async ({ page }) => {
    const signupPage = new SignupPage(page);

    await goToPayment(signupPage, { coupon: "Legacy-Gratis" });
    await signupPage.fillPaymentDetails({
      cardNumber: "5590490217708385",
      cvv: "279",
    });
    await expect(signupPage.submitButton).toBeDisabled();
  });

  test('Missing CVV', async ({ page }) => {
    const signupPage = new SignupPage(page);

    await goToPayment(signupPage, { coupon: "Legacy-Gratis" });
    await signupPage.fillPaymentDetails({
      cardNumber: "5590490217708385",
      expiry: "08/28",
    });
    await expect(signupPage.submitButton).toBeDisabled();
  });


});

// Straight Signup > Happy path
test("Complete signup happy path", async ({ page }) => {
  const signupPage = new SignupPage(page);

  await signupPage.gotoPricing();
  await signupPage.casualPlanCta.click();
  await configureSelectStudio(signupPage, { coupon: "Legacy-Gratis" });
  await signupPage.nextButton.click();

  await signupPage.fillPersonalDetails({
    firstName: "Muhammad ",
    lastName: "Test123",
    phone: "2143442142",
    email: data.Account_email,
    password: "Test@1234567!",
    confirmPassword: "Test@1234567!",
    dob: "12/27/1995",
    subscribeEmail: true,
    subscribeSms: true,
  });
  await signupPage.acceptTerms();
  await signupPage.nextButton.click();

  await signupPage.fillPaymentDetails({
    cardNumber: "559045450217708385",
    expiry: "08/28",
    cvv: "279",
  });
  await signupPage.submitButton.click();
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL("https://app.prontopilates.com/dashboard");
});
