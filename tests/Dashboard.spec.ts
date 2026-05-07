import { expect, test } from "@playwright/test";
import { BookingPage } from "../pages/BookingPage";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { MyClassesPage } from "../pages/MyClassesPage";

test.describe("Dashboard Text Visibility", () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.goto();
    await loginPage.login("muhammad.sqaexpert@gmail.com", "Test@1234567!");
    await dashboardPage.waitForLoad();
  });

  test('Verify "Dashboard" title is displayed', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.dashboardTitle).toBeVisible();
  });

  test('Verify greeting "Hi [username]," is displayed', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const fullName = (await dashboardPage.greetingName.innerText()).trim();
    const firstName = fullName.split(" ")[0];
    const greeting = dashboardPage.greetingFor(firstName);

    await expect(greeting).toBeVisible();
    await expect(greeting).toContainText('Hi');
  });

  test('Verify "Great to see you here!" message is displayed', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.greatToSeeMessage).toBeVisible();
  });

  test('Verify "Upcoming Classes" section title is displayed', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.upcomingClassesTitle).toBeVisible();
  });

  test('Verify "No classes on your schedule." message is displayed', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    await expect(dashboardPage.noClassesMessage).toBeVisible();
  });

  test('Verify clicking "Book Classes" redirects to booking page', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await dashboardPage.bookClassesButton.click();
    await expect(page).toHaveURL(/\/book/);
  });

  test('Verify the booked class appears on the dashboard', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const bookingPage = new BookingPage(page);

    if (await dashboardPage.noClassesMessage.isHidden()) {
      // Ensure dashboard reflects empty state before starting
      await page.goto('https://app.prontopilates.com/my-classes');
      const myClassesPage = new MyClassesPage(page);
      await myClassesPage.cancelLatestBooking();
      await page.goto('https://app.prontopilates.com/dashboard');
      await dashboardPage.waitForLoad();
    }

    await expect(dashboardPage.noClassesMessage).toBeVisible();

    await bookingPage.goto();
    const studioName = await bookingPage.getStudioName();
    await bookingPage.bookClassFromList();
    const bookingDetails = await bookingPage.extractBookedCardDetails();

    await page.goto('https://app.prontopilates.com/dashboard');
    await page.waitForLoadState('networkidle');

    const refreshedDashboard = new DashboardPage(page);
    const rawTimeDate = await refreshedDashboard.bookedClassTimeDate.innerText();
    const dashboardTypeRaw = await refreshedDashboard.bookedClassTitle.textContent();
    const dashboardLevelRaw = await refreshedDashboard.bookedClassDetails.first().textContent();

    const dashboardTypeClean = dashboardTypeRaw?.replace('Class', '').trim().toLowerCase();
    const dashboardDay = rawTimeDate.match(/\d+/)?.[0];
    const bookingDay = bookingDetails.date.match(/\d+/)?.[0];
    const dashboardLevel = dashboardLevelRaw?.split('???')[1]?.trim();
    const dashboardStudio = dashboardLevelRaw?.match(/Pronto Pilates\s+(.+)$/)?.[1]?.trim();

    expect(dashboardTypeClean).toContain(bookingDetails.classType.toLowerCase());
    expect(dashboardDay).toBe(bookingDay);
    expect(dashboardLevel).toContain(bookingDetails.level.split('/')[0]);
    expect(dashboardStudio).toContain(studioName);

    const myClassesPage = new MyClassesPage(page);
    await refreshedDashboard.allClassesButton.click();
    await myClassesPage.cancelLatestBooking();
    await page.goto('https://app.prontopilates.com/dashboard');
    await expect(refreshedDashboard.noClassesMessage).toBeVisible();
  });

  test('Verify the "All classes" button redirects to the "My-Classes" page when clicked', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    if (await dashboardPage.noClassesMessage.isHidden()) {
      await dashboardPage.allClassesButton.click();
      await expect(page).toHaveURL('https://app.prontopilates.com/my-classes');
    } else {
      await expect(dashboardPage.noClassesMessage).toBeVisible();
    }
  });

  test('Extract booked class details after booking and verify on dashboard', async ({ page }) => {
    const bookingPage = new BookingPage(page);

    await bookingPage.goto();
    const studioName = await bookingPage.getStudioName();
    await bookingPage.bookClassFromList();
    const bookingDetails = await bookingPage.extractBookedCardDetails();

    await page.goto('https://app.prontopilates.com/dashboard');
    await page.waitForLoadState('networkidle');

    const dashboardPage = new DashboardPage(page);
    const rawTimeDate = await dashboardPage.bookedClassTimeDate.innerText();
    const typeRaw = await dashboardPage.bookedClassTitle.textContent();
    const levelRaw = await dashboardPage.bookedClassDetails.first().textContent();

    const timeSegment = rawTimeDate.split('-')[0]?.trim();
    const dashboardTime = timeSegment?.split(' - ')[0]?.trim();
    const dashboardDate = timeSegment?.split(', ')[1]?.trim();
    const dashboardType = typeRaw?.replace('Class', '').trim().toLowerCase();
    const dashboardLevel = levelRaw?.split('???')[1]?.trim();
    const dashboardStudio = levelRaw?.match(/Pronto Pilates\s+(.+)$/)?.[1]?.trim();

    expect(dashboardType).toContain(bookingDetails.classType.toLowerCase());
    expect(dashboardDate?.match(/\d+/)?.[0]).toBe(bookingDetails.date.match(/\d+/)?.[0]);
    expect(dashboardLevel).toContain(bookingDetails.level.split('/')[0]);
    expect(dashboardStudio).toContain(studioName);

    const myClassesPage = new MyClassesPage(page);
    await dashboardPage.allClassesButton.click();
    await myClassesPage.cancelLatestBooking();
    await page.goto('https://app.prontopilates.com/dashboard');
    await expect(dashboardPage.noClassesMessage).toBeVisible();
  });

  test('Verify the medal Image appears', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await expect(dashboardPage.medalBackground).toBeVisible();
    await expect(dashboardPage.medalBackground).toHaveAttribute('style', /background-image:\s?url\(["']?\/studio\.jpg["']?\)/);
    await expect(dashboardPage.planDetailsHeading).toBeVisible();
    await expect(dashboardPage.medalImage).toBeVisible();
    await expect(dashboardPage.planDetailsBanner).toBeVisible();
    await expect(dashboardPage.planName).toBeVisible();
    await expect(dashboardPage.planStudio).toBeVisible();
    await expect(dashboardPage.planAccountEmail).toBeVisible();
    await expect(dashboardPage.planNextPayment).toBeVisible();
    await expect(dashboardPage.planCouponApplied).toBeVisible();
  });

  test('Verify the "Book Classes" button is visible', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    await expect(dashboardPage.bookClassesButton).toBeVisible();
    await dashboardPage.manageMembershipLink.click();
    await expect(page).toHaveURL('https://app.prontopilates.com/manage-membership');
  });
});
