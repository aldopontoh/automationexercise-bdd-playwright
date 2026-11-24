const { expect } = require('@playwright/test');
const { Given, When, Then } = require('../fixtures/bddFixtures');
const { createSubscriptionEmail } = require('../utils/testDataFactory');

Given('I am on the Automation Exercise home page', async ({ homePage }) => {
  await homePage.open();
});

Then('the home page should display core branding, hero carousel, and {int} featured products', async ({ page, homePage }, expectedCount) => {
  await expect(page).toHaveTitle('Automation Exercise');
  await expect(homePage.heroCarousel).toBeVisible();
  await expect(homePage.heroSlides).toHaveCount(3);
  await expect(homePage.featuresItemsHeading).toBeVisible();
  await expect(homePage.featuredProductCards).toHaveCount(expectedCount);
  await expect(homePage.categorySidebarHeading).toBeVisible();
  await expect(homePage.brandsSidebarHeading).toBeVisible();
  await expect(homePage.recommendedItemsSection).toBeVisible();
});

When('I navigate across all primary header routes from the home page', async ({ page, homePage, productsPage, cartPage, authPage, contactUsPage }) => {
  await homePage.goToProducts();
  await expect(page).toHaveURL(/\/products$/);
  await expect(productsPage.catalogHeading).toHaveText(/All Products/i);

  await homePage.goToCart();
  await expect(page).toHaveURL(/\/view_cart$/);
  await expect(cartPage.emptyCartBanner).toBeVisible();

  await homePage.goToLogin();
  await expect(page).toHaveURL(/\/login$/);
  await expect(authPage.loginHeading).toBeVisible();

  await homePage.goToTestCases();
  await expect(page).toHaveURL(/\/test_cases$/);
  await expect(homePage.referencePageHeading).toHaveText(/Test Cases/i);

  await homePage.goToApiTesting();
  await expect(page).toHaveURL(/\/api_list$/);
  await expect(homePage.referencePageHeading).toHaveText(/APIs List for practice/i);

  await homePage.goToContactUs();
  await expect(page).toHaveURL(/\/contact_us$/);
  await expect(contactUsPage.getInTouchHeading).toBeVisible();
});

Then('every primary navigation route should load cleanly', async ({ page }) => {
  await expect(page).toHaveURL(/\/contact_us$/);
  await expect(page).toHaveTitle('Automation Exercise - Contact Us');
});

When('I subscribe to the footer newsletter with a valid email address', async ({ homePage }) => {
  await expect(homePage.subscriptionHeading).toBeVisible();
  await homePage.subscribeToNewsletter(createSubscriptionEmail());
});

Then('I should see the newsletter subscription success banner', async ({ homePage }) => {
  await expect(homePage.subscriptionSuccessAlert).toBeVisible();
  await expect(homePage.subscriptionSuccessAlert).toContainText('You have been successfully subscribed!');
});

When('I attempt to subscribe to the footer newsletter with an invalid email {string}', async ({ homePage }, invalidEmail) => {
  await homePage.subscribeToNewsletter(invalidEmail);
});

Then('the footer newsletter email field should fail HTML5 validation', async ({ homePage }) => {
  const isValid = await homePage.isControlValid(homePage.subscriptionEmailInput);
  expect(isValid).toBe(false);
  await expect(homePage.subscriptionSuccessAlert).not.toBeVisible();
});

When('I visit the Test Cases and API Testing reference pages', async ({ page, homePage }) => {
  await homePage.openTestCasesPage();
  await expect(page).toHaveTitle('Automation Practice Website for UI Testing - Test Cases');
  await expect(homePage.referencePageHeading).toHaveText(/Test Cases/i);
  await expect(homePage.referenceAccordionPanels).toHaveCount(27);

  await homePage.openApiListPage();
  await expect(page).toHaveTitle('Automation Practice for API Testing');
  await expect(homePage.referencePageHeading).toHaveText(/APIs List for practice/i);
  await expect(homePage.referenceAccordionPanels).toHaveCount(15);
});

Then('both reference pages should expose expected titles, headings, and panels', async ({ homePage }) => {
  await expect(homePage.referenceAccordionPanels.first()).toContainText(/API 1/i);
});

When('I scroll down to the bottom of the home page', async ({ homePage }) => {
  await homePage.scrollToBottom();
  await expect(homePage.subscriptionHeading).toBeVisible();
  await expect.poll(() => homePage.getScrollY()).toBeGreaterThan(200);
});

When('I click the floating scroll-up arrow button', async ({ homePage }) => {
  await expect(homePage.scrollUpArrow).toBeVisible();
  await homePage.clickScrollUpArrow();
});

When('I scroll manually back to the top of the home page', async ({ homePage }) => {
  await homePage.scrollToTopManually();
});

Then('the page should scroll back to the top with the hero banner subtitle in viewport', async ({ homePage }) => {
  await expect.poll(() => homePage.getScrollY()).toBeLessThan(100);
  await expect(homePage.activeHeroSubtitle).toBeVisible();
  await expect(homePage.activeHeroSubtitle).toBeInViewport();
  await expect(homePage.activeHeroSubtitle).toContainText(
    'Full-Fledged practice website for Automation Engineers'
  );
});
