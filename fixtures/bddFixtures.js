const { test: base, createBdd } = require('playwright-bdd');
const { HomePage } = require('../pages/HomePage');
const { ProductsPage } = require('../pages/ProductsPage');
const { ProductDetailsPage } = require('../pages/ProductDetailsPage');
const { CartPage } = require('../pages/CartPage');
const { AuthPage } = require('../pages/AuthPage');
const { SignupFormPage } = require('../pages/SignupFormPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { PaymentPage } = require('../pages/PaymentPage');
const { ContactUsPage } = require('../pages/ContactUsPage');

const AD_BLOCK_PATTERNS = [
  '**/*googlesyndication.com/**',
  '**/*doubleclick.net/**',
  '**/*googleadservices.com/**',
  '**/*adservice.google.com/**',
  '**/*fundingchoicesmessages.google.com/**',
];

const test = base.extend({
  // Automatically block third-party ad networks to prevent #google_vignette flakes
  page: async ({ page }, use) => {
    for (const pattern of AD_BLOCK_PATTERNS) {
      await page.route(pattern, (route) => route.abort());
    }
    await use(page);
  },

  // Per-scenario shared state + automatic ephemeral account teardown
  testContext: async ({ page }, use) => {
    const context = {
      createdUser: null,
      accountCreated: false,
      accountDeleted: false,
      subscriptionEmail: null,
      recommendedItem: null,
      downloadedInvoice: null,
    };

    await use(context);

    // Self-cleaning safety net: delete ONLY if the account was actually created and not yet deleted
    if (context.createdUser && context.accountCreated && !context.accountDeleted) {
      try {
        const authPage = new AuthPage(page);
        await authPage.navigateTo('/');
        const deleteVisible = await authPage.deleteAccountNavLink.isVisible().catch(() => false);
        if (!deleteVisible) {
          await authPage.open();
          await authPage.login(context.createdUser.email, context.createdUser.password);
        }
        const canDelete = await authPage.deleteAccountNavLink.isVisible().catch(() => false);
        if (canDelete) {
          await authPage.clickDeleteAccount();
          context.accountDeleted = true;
        }
      } catch {
        // Best-effort cleanup during teardown; never mask original test assertion failures
      }
    }
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  productDetailsPage: async ({ page }, use) => {
    await use(new ProductDetailsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  signupFormPage: async ({ page }, use) => {
    await use(new SignupFormPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
  contactUsPage: async ({ page }, use) => {
    await use(new ContactUsPage(page));
  },
});

const { Given, When, Then, Before, After } = createBdd(test);

module.exports = {
  test,
  Given,
  When,
  Then,
  Before,
  After,
};
