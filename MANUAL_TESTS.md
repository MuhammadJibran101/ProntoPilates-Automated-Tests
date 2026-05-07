# Manual Test Plan for ProntoAutomation

## Project Overview
This repository contains Playwright automated tests for the Pronto Pilates application. The automated suites cover authentication, password recovery, signup workflows, dashboard behavior, class booking, and side menu navigation.

## Environment Setup
- Browser: Chromium
- Node.js installed
- Dependencies installed via `npm install`
- Test runner: Playwright
- Application URLs use `https://app.prontopilates.com`
- Test account: `muhammad.sqaexpert@gmail.com` / `Test@1234567!`

## Test Suites

### 1. Login Tests (`tests/Login.spec.js`)

1. Login - Positive
   - Open login page
   - Enter valid email and password
   - Submit
   - Expect dashboard page to load

2. Login - Invalid credentials (Incorrect Email)
   - Open login page
   - Enter invalid email and valid password
   - Submit
   - Expect invalid email error visible

3. Login - Invalid credentials (Incorrect Password)
   - Open login page
   - Enter valid email and wrong password
   - Submit
   - Expect invalid password error visible

4. Login - Validation for empty fields
   - Open login page
   - Leave email blank, enter password, submit
   - Expect email required error
   - Reload page
   - Enter email, leave password blank, submit
   - Expect password required error

### 2. Forgot Password Tests (`tests/ForgotPassword.spec.js`)

1. Forgot Password - Navigate
   - Open login page
   - Click forgot password link
   - Expect forgot password page visible

2. Forgot Password - Invalid Email
   - Open forgot password page
   - Enter invalid email format
   - Request reset
   - Expect invalid email error visible

3. Forgot Password - Valid Email
   - Open forgot password page
   - Enter valid registered email
   - Request reset
   - Expect success illustration or confirmation visible

4. Forgot Password - Email is required
   - Open forgot password page
   - Submit empty email
   - Expect email required error visible

5. Forgot Password - Back to Login
   - Open forgot password page
   - Click back to login link
   - Expect login page URL

6. Forgot Password - Go Back
   - Navigate to forgot password page from login
   - Click back to login
   - Expect return to login page

### 3. Signup Tests (`tests/Signup.spec.js`)

#### Select Studio Tab

1. Casual Plan URL
   - Open signup pricing page
   - Click casual plan CTA
   - Expect URL contains `chargebee_id=Casual-Plan-AUD-Monthly`

2. Next button Disable
   - Open signup
   - Leave required selects unselected
   - Expect Next button disabled when state/studio/media not selected

3. Verify next payment date is correct
   - Open signup
   - Check next payment text
   - Expect it matches next month’s date formatting

4. Radio button selection
   - Open signup
   - Verify all access yes/no labels and selection behavior
   - Expect content section visibility toggles with selection

5. Check All States
   - Open signup
   - Open state dropdown
   - Expect 6 state options visible including NSW, VIC, QLD, WA, SA, TAS

6. Social Media Drop-downs
   - Open signup
   - Open media dropdown
   - Expect 5 non-empty options visible

7. Discount Code button
   - Open signup
   - Click discount code
   - Expect coupon error on initial use
   - Apply valid coupon codes
   - Expect coupon applied notifications and discounted pricing display

#### Personal Details Tab

1. Signup - Missing First Name
   - Open signup through personal details
   - Leave first name blank
   - Fill other fields and accept terms
   - Expect Next button disabled

2. Signup - Missing Last Name
   - Leave last name blank
   - Expect Next button disabled

3. Signup - Invalid Email Format
   - Enter invalid email format
   - Expect Next button disabled

4. Signup - Passwords Do Not Match
   - Enter different confirm password
   - Expect Next button disabled

5. Signup - Invalid Date of Birth
   - Enter invalid birth date (future/too young)
   - Expect Next button disabled

6. Signup - Unchecked Terms and Conditions
   - Leave terms unchecked
   - Expect Next button disabled

#### Easy Payment Tab

1. Invalid Card Number
   - Complete signup to payment step
   - Enter invalid card number and submit
   - Expect payment alert visible

2. Missing Card Number
   - Leave card number blank
   - Expect submit button disabled

3. Missing Expiry Date
   - Leave expiry blank
   - Expect submit button disabled

4. Missing CVV
   - Leave CVV blank
   - Expect submit button disabled

#### Complete Signup Happy Path

1. Complete signup happy path
   - Start signup from pricing page
   - Select casual plan and studio with valid coupon
   - Fill personal details and accept terms
   - Fill payment info
   - Submit and expect dashboard URL

### 4. Dashboard Tests (`tests/Dashboard.spec.js`)

1. Verify Dashboard title is displayed
   - Log in
   - Expect dashboard title visible

2. Verify greeting is displayed
   - Expect greeting text with user first name visible and contains `Hi`

3. Verify welcome message is displayed
   - Expect `Great to see you here!` text visible

4. Verify Upcoming Classes section title displayed
   - Expect upcoming classes title visible

5. Verify no classes message displayed
   - Expect empty schedule message visible when no booked classes exist

6. Verify Book Classes redirects to booking page
   - Click Book Classes
   - Expect /book URL or booking page URL visible

7. Verify booked class appears on dashboard
   - If no classes present, book a class from booking page
   - Return to dashboard
   - Verify booked class details, type, date, level, and studio match booking
   - Cancel booking and verify empty schedule state again

8. Verify All classes button redirects to My Classes page
   - Click All classes
   - Expect My Classes page URL visible

9. Extract booked class details and verify on dashboard
   - Book a class
   - Return to dashboard
   - Verify date, type, level, and studio on the dashboard card
   - Cancel booking afterward

10. Verify medal image appears
    - Verify reward/medal section elements are visible, including images and plan details

11. Verify Book Classes button is visible
    - Confirm the button is visible
    - Click Manage Membership link
    - Expect manage membership URL

### 5. Book Classes Tests (`tests/BookClasses.spec.js`)

1. Date Picker
   - Log in and open Book Classes page
   - Open date picker calendar
   - Verify calendar visible and today button works

2. Verify filter behavior
   - Open filters
   - Select Foundation, Orientation, and Open filters
   - Apply filters and verify displayed classes only match selected types
   - Clear filters and verify full class count returns

3. Verify Book button redirects
   - Check all class buttons
   - Click each `Book Now` button
   - Verify redirect to details page and back navigation works

4. Verify studio can be selected from drop-down
   - Open studio selector
   - Choose a studio such as South Perth
   - Verify selection updates

5. User should not be able to book past classes
   - Compare class times against current Perth time
   - Verify past classes do not show `Book Now`
   - Future classes should still show booking options

6. Should not allow booking of past classes and should allow future classes
   - Set geolocation to Perth
   - For each class card, verify past classes hide booking/join waitlist options and future classes show at least one booking option

### 6. Side Menu Tests (`tests/SideMenu.spec.js`)

1. Side Menu navigation
   - Log in
   - Open each side menu destination: Membership, Book, My Classes, Shop, Profile, Class Credits, Payments, Studio Etiquette, Notifications, Help & Support
   - Log out via side menu
   - Log in again
   - Log out from profile menu

## Notes
- Some tests depend on a valid user account and existing studio/class availability.
- The suite includes UI flows, validation checks, navigation verification, and booking behavior.
- The manual test plan should be updated if page text, selectors, or workflows change.
