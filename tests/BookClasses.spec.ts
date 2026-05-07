import fs from "fs";
import { test, expect } from "@playwright/test";
import { DateTime } from "luxon";
import { LoginPage } from "../pages/LoginPage";
import { BookingPage } from "../pages/BookingPage";

const content = JSON.parse(fs.readFileSync("data.json", "utf-8"));

async function loginAndOpenBook(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("muhammad.sqaexpert@gmail.com", "Test@1234567!");
  await loginPage.expectOnDashboard();

  const bookingPage = new BookingPage(page);
  await bookingPage.goto();
  await bookingPage.page.waitForLoadState("networkidle");
  return bookingPage;
}


test.describe("Book classes tab", () => {
  test("Date Picker", async ({ page }) => {
    const bookingPage = await loginAndOpenBook(page);

    await bookingPage.calendarToggleButton.click();
    await expect(bookingPage.calendarDialog).toBeVisible();
    await bookingPage.calendarTodayButton.click();
  });

  // test.only("Verify that the the first date of week is selected when the user clicks right arrow", async ({ page }) => {
  //   const bookingPage = await loginAndOpenBook(page);
  //   await expect(bookingPage.weekpreviousButton).toBeDisabled();
  //   await bookingPage.weekNextButton.click();
  //   const weekContainer = page.locator('div.mt-4.inline-flex');
  //   const firstDayButton = weekContainer.locator('button').first();
  //   await expect(firstDayButton).toHaveClass(/bg-pomegranate-100\/60/);
  //   console.log('First day:', await firstDayButton.innerText());
  // });

  test("Verify that the filter is is working properly", async ({ page }) => {
    const bookingPage = await loginAndOpenBook(page);

    await bookingPage.filterButton.click();
    await expect(bookingPage.filtersModal).toBeVisible();
    await expect(bookingPage.applyFiltersButton).toBeVisible();

    const classesArray = ["orientation", "foundation", "open",];
   const totalClasscount = await bookingPage.classTypeLabels.count();
    await bookingPage.filterOption("filter image Foundation").click();
    await bookingPage.filterOption("filter image Orientation").click();
    await bookingPage.filterOption("filter image Open").click();
    await bookingPage.applyFiltersButton.click();

    const classTypeTexts = await bookingPage.classTypeLabels.allTextContents();
    console.log(classTypeTexts);

    for (const classType of classTypeTexts) {
      const type = classType.trim().toLowerCase();
      expect(classesArray).toContain(type);
    }

    await bookingPage.clearFiltersButton.click();
    const resetClassTypes = await bookingPage.classTypeLabels.allTextContents();
    expect(resetClassTypes.length).toEqual(totalClasscount);
  });

  test("Verify that the Book button redirects to the book details page ", async ({ page }) => {
    const bookingPage = await loginAndOpenBook(page);

    await page.waitForTimeout(2000);
    const totalButtons = await bookingPage.allButtons.count();
    let bookNowCount = 0;
    let waitlistCount = 0;

    for (let i = 0; i < totalButtons; i += 1) {
      const button = bookingPage.allButtons.nth(i);
      const text = (await button.textContent())?.trim().toLowerCase();

      if (text === "book now") {
        bookNowCount += 1;
        await button.click();
        await expect(bookingPage.backButton).toBeVisible();
        await bookingPage.backButton.click();
        await bookingPage.page.waitForLoadState("networkidle");
      }

      if (text === "join waitlist") {
        waitlistCount += 1;
      }
    }

    console.log(`Book Now: ${bookNowCount}`);
    console.log(`Join Waitlist: ${waitlistCount}`);
  });

  test("Verify that the user can select the any studio from the drop-down", async ({ page }) => {
    const bookingPage = await loginAndOpenBook(page);

    await bookingPage.studioDisplayByName(content.Studio).nth(1).click();
    await expect(bookingPage.studioMenu).toBeVisible();
    await bookingPage.studioMenuItem("South Perth").click();
    await expect(bookingPage.studioDisplayByName("South Perth").first()).toBeVisible();
  });

  test("User should not be able to book past classes", async ({ page }) => {
    const bookingPage = await loginAndOpenBook(page);

    const perthNow = DateTime.now().setZone("Australia/Perth");
    const currentMinutes = perthNow.hour * 60 + perthNow.minute;
    const count = await bookingPage.classCards.count();

    for (let i = 0; i < count; i += 1) {
      const card = bookingPage.classCards.nth(i);
      const timeLabel = bookingPage.classCardTimeLabel(card);
      if ((await timeLabel.count()) === 0) {
        continue;
      }

      const timeText = (await timeLabel.textContent())?.trim();
      if (!timeText) {
        continue;
      }

      const match = timeText.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
      if (!match) {
        continue;
      }

      let [_, hour, minute, period] = match;
      hour = parseInt(hour, 10);
      minute = parseInt(minute, 10);
      if (period.toLowerCase() === "pm" && hour !== 12) hour += 12;
      if (period.toLowerCase() === "am" && hour === 12) hour = 0;
      const classMinutes = hour * 60 + minute;

      const hasBookNow = await bookingPage.bookNowButtonInCard(card).isVisible();

      if (classMinutes < currentMinutes) {
        expect(hasBookNow).toBeFalsy();
      } else {
        expect(hasBookNow).toBeTruthy();
      }
    }
  });

  test("should not allow booking of past classes and should allow for future classes", async ({ page }) => {
    const bookingPage = await loginAndOpenBook(page);

    await page.context().setGeolocation({ latitude: -31.9523, longitude: 115.8613 });

    const perthTime = new Date().toLocaleString("en-US", { timeZone: "Australia/Perth" });
    const perthNow = new Date(perthTime);
    const cardCount = await bookingPage.classCardWrapper.count();

    for (let i = 0; i < cardCount; i += 1) {
      const card = bookingPage.classCardWrapper.nth(i);
      const timeElement = bookingPage.classCardTimeLabel(card);
      const classStartTimeText = (await timeElement.textContent())?.trim();
      if (!classStartTimeText) {
        continue;
      }

      const classStartTime = new Date(`${perthNow.toDateString()} ${classStartTimeText}`);
      const bookNowButton = bookingPage.bookNowButtonInCard(card);
      const joinWaitlistButton = bookingPage.joinWaitlistButtonInCard(card);

      if (classStartTime < perthNow) {
        await expect(bookNowButton).not.toBeVisible();
        await expect(joinWaitlistButton).not.toBeVisible();
      } else {
        const isBookNowVisible = await bookNowButton.isVisible();
        const isJoinWaitlistVisible = await joinWaitlistButton.isVisible();

        expect(isBookNowVisible || isJoinWaitlistVisible).toBe(true);
      }
    }
  });
});
