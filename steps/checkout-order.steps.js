const { expect } = require('@playwright/test');
const { Given, When, Then } = require('../fixtures/bddFixtures');
const { createUser, createDummyPayment } = require('../utils/testDataFactory');

Given('I am an authenticated ephemeral user with product {int} in my cart', async ({ authPage, signupFormPage, productsPage, testContext }, productId) => {
  const user = createUser();
  testContext.createdUser = user;
  testContext.accountCreated = false;
  testContext.accountDeleted = false;

  await authPage.open();
  await authPage.startSignup(user.name, user.email);
  await expect(signupFormPage.accountInfoHeading).toBeVisible();
  await signupFormPage.fillAndSubmitRegistration(user);
  await expect(authPage.accountCreatedHeading).toBeVisible();
  testContext.accountCreated = true;
  await authPage.clickContinue();
  await expect(authPage.loggedInAsBadge).toContainText(user.name);

  await productsPage.open();
  await productsPage.addProductById(productId);
  await expect(productsPage.cartModal).toBeVisible();
  await productsPage.openCartFromModal();
});

When('I proceed from the cart to the checkout page', async ({ cartPage }) => {
  await cartPage.clickProceedToCheckout();
});

Then('the checkout delivery and billing addresses should match my registration profile with total {string}', async ({ checkoutPage, testContext }, expectedTotal) => {
  const user = testContext.createdUser;
  await expect(checkoutPage.addressDetailsHeading).toBeVisible();
  await expect(checkoutPage.reviewOrderHeading).toBeVisible();

  for (const addressBlock of [checkoutPage.deliveryAddressBlock, checkoutPage.billingAddressBlock]) {
    await expect(addressBlock).toContainText(`${user.firstName} ${user.lastName}`);
    await expect(addressBlock).toContainText(user.address1);
    await expect(addressBlock).toContainText(user.city);
    await expect(addressBlock).toContainText(user.state);
    await expect(addressBlock).toContainText(user.zipcode);
    await expect(addressBlock).toContainText(user.country);
    await expect(addressBlock).toContainText(user.mobileNumber);
  }

  await expect(checkoutPage.orderReviewTable).toContainText('Blue Top');
  await expect(checkoutPage.grandTotalPrice).toHaveText(expectedTotal);
});

When('I enter an order comment {string} and click Place Order', async ({ checkoutPage }, comment) => {
  await checkoutPage.enterOrderComment(comment);
  await checkoutPage.clickPlaceOrder();
});

Then('I should reach the Payment page with all required card fields visible', async ({ page, paymentPage }) => {
  await expect(page).toHaveURL(/\/payment$/);
  await expect(paymentPage.paymentHeading).toBeVisible();
  await expect(paymentPage.nameOnCardInput).toBeVisible();
  await expect(paymentPage.cardNumberInput).toBeVisible();
  await expect(paymentPage.cvcInput).toBeVisible();
  await expect(paymentPage.expiryMonthInput).toBeVisible();
  await expect(paymentPage.expiryYearInput).toBeVisible();
  await expect(paymentPage.payAndConfirmButton).toBeVisible();
});

When('I submit synthetic sandbox payment card details', async ({ paymentPage }) => {
  await paymentPage.fillPaymentDetails(createDummyPayment());
  await paymentPage.submitPayment();
});

Then('I should see the Order Placed confirmation message', async ({ page, paymentPage }) => {
  await expect(page).toHaveURL(/\/payment_done\//);
  await expect(paymentPage.orderPlacedHeading).toBeVisible();
  await expect(paymentPage.orderConfirmedMessage).toBeVisible();
});

When('I attempt to submit the Payment form with empty card fields', async ({ paymentPage }) => {
  await paymentPage.submitPayment();
});

Then('the Payment form should fail HTML5 validation and remain on the payment route', async ({ page, paymentPage }) => {
  const isCardNameValid = await paymentPage.isControlValid(paymentPage.nameOnCardInput);
  const isCardNumberValid = await paymentPage.isControlValid(paymentPage.cardNumberInput);
  expect(isCardNameValid).toBe(false);
  expect(isCardNumberValid).toBe(false);
  await expect(page).toHaveURL(/\/payment$/);
});

Then('both Checkout and Payment pages should expose valid titles, headings, and accessible CTA controls', async ({ page, checkoutPage, paymentPage }) => {
  await expect(page).toHaveTitle('Automation Exercise - Checkout');
  await expect(checkoutPage.addressDetailsHeading).toBeVisible();
  await expect(checkoutPage.reviewOrderHeading).toBeVisible();
  await expect(checkoutPage.placeOrderLink).toBeVisible();

  await checkoutPage.clickPlaceOrder();
  await expect(page).toHaveTitle('Automation Exercise - Payment');
  await expect(paymentPage.paymentHeading).toBeVisible();
  await expect(paymentPage.payAndConfirmButton).toBeVisible();
});

When('I register a new ephemeral user via the guest checkout modal and return to checkout', async ({ cartPage, authPage, signupFormPage, testContext }) => {
  await expect(cartPage.checkoutModal).toBeVisible();
  await cartPage.clickRegisterLoginInModal();

  const user = createUser();
  testContext.createdUser = user;
  testContext.accountCreated = false;
  testContext.accountDeleted = false;

  await authPage.startSignup(user.name, user.email);
  await expect(signupFormPage.accountInfoHeading).toBeVisible();
  await signupFormPage.fillAndSubmitRegistration(user);
  await expect(authPage.accountCreatedHeading).toBeVisible();
  testContext.accountCreated = true;
  await authPage.clickContinue();
  await expect(authPage.loggedInAsBadge).toContainText(user.name);

  await cartPage.goToCart();
  await cartPage.clickProceedToCheckout();
});

When('I log in with the existing ephemeral user and add product {int} to the cart', async ({ authPage, productsPage, testContext }, productId) => {
  await authPage.open();
  await authPage.login(testContext.createdUser.email, testContext.createdUser.password);
  await expect(authPage.loggedInAsBadge).toContainText(testContext.createdUser.name);

  await productsPage.open();
  await productsPage.addProductById(productId);
  await expect(productsPage.cartModal).toBeVisible();
  await productsPage.openCartFromModal();
});

When('I download the purchase invoice from the order confirmation page', async ({ paymentPage, testContext }) => {
  await expect(paymentPage.downloadInvoiceLink).toBeVisible();
  testContext.downloadedInvoice = await paymentPage.downloadInvoice();
});

Then('the downloaded invoice file should be non-empty and I can continue back home', async ({ page, paymentPage, testContext }) => {
  expect(testContext.downloadedInvoice.suggestedFilename).toMatch(/invoice/i);
  expect(testContext.downloadedInvoice.content.trim().length).toBeGreaterThan(0);
  await paymentPage.clickContinue();
  await expect(page).toHaveURL(/\/$/);
});
