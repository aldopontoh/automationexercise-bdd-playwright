class BasePage {
  constructor(page) {
    this.page = page;

    // Header navigation locators (verified against live DOM)
    this.header = page.locator('#header');
    this.homeNavLink = this.header.getByRole('link', { name: /Home/i }).last();
    this.productsNavLink = this.header.getByRole('link', { name: /Products/i });
    this.cartNavLink = this.header.getByRole('link', { name: /Cart/i });
    this.signupLoginNavLink = this.header.getByRole('link', { name: /Signup \/ Login/i });
    this.logoutNavLink = this.header.getByRole('link', { name: /Logout/i });
    this.deleteAccountNavLink = this.header.getByRole('link', { name: /Delete Account/i });
    this.testCasesNavLink = this.header.getByRole('link', { name: /Test Cases/i });
    this.apiTestingNavLink = this.header.getByRole('link', { name: /API Testing/i });
    this.contactUsNavLink = this.header.getByRole('link', { name: /Contact us/i });
    this.loggedInAsBadge = this.header.getByText(/Logged in as/i);

    // Footer newsletter locators (live DOM uses #susbscribe_email)
    this.footer = page.locator('#footer');
    this.subscriptionHeading = this.footer.getByRole('heading', { name: /Subscription/i });
    this.subscriptionEmailInput = this.page.getByPlaceholder('Your email address');
    this.subscriptionSubmitButton = this.page.locator('#subscribe');
    this.subscriptionSuccessAlert = this.page.locator('#success-subscribe');

    // Cookie consent banner locator (EU / Funding Choices)
    this.consentAcceptButton = this.page.locator(
      'button.fc-cta-consent, button[aria-label="Consent"], .fc-consent-root button:has-text("Consent")'
    ).first();

    // Server overload banner returned intermittently by automationexercise.com
    this.heavyLoadHeading = this.page.getByRole('heading', {
      name: /This website is under heavy load/i,
    });
  }

  async dismissConsentIfPresent() {
    const visible = await this.consentAcceptButton.isVisible().catch(() => false);
    if (visible) {
      await this.consentAcceptButton.click().catch(() => {});
    }
  }

  async isHeavyLoadPage() {
    return this.heavyLoadHeading.isVisible().catch(() => false);
  }

  async recoverFromVignette(targetPath) {
    if (this.page.url().includes('#google_vignette')) {
      await this.page.goto(targetPath, { waitUntil: 'domcontentloaded' });
      await this.dismissConsentIfPresent();
    }
  }

  async recoverFromHeavyLoad(targetPath, maxAttempts = 4) {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const overloaded = await this.isHeavyLoadPage();
      if (!overloaded) {
        return;
      }
      const destination = targetPath || this.page.url();
      await this.page.goto(destination, { waitUntil: 'domcontentloaded' }).catch(() => {});
      await this.dismissConsentIfPresent();
    }
  }

  async navigateTo(path = '/', maxAttempts = 4) {
    let lastError;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        await this.page.goto(path, { waitUntil: 'domcontentloaded' });
        await this.dismissConsentIfPresent();
        await this.recoverFromVignette(path);
        const overloaded = await this.isHeavyLoadPage();
        if (!overloaded) {
          return;
        }
        lastError = new Error(`AUT returned heavy load queue-full page on ${path}`);
      } catch (err) {
        lastError = err;
        if (attempt === maxAttempts) {
          throw err;
        }
      }
    }
    if (lastError) {
      throw lastError;
    }
  }

  async clickNavLink(locator, expectedPath) {
    await this.dismissConsentIfPresent();
    await Promise.all([
      this.page
        .waitForURL(
          (url) => url.pathname === expectedPath || url.hash.includes('google_vignette'),
          { waitUntil: 'domcontentloaded', timeout: 30000 }
        )
        .catch(() => {}),
      locator.click(),
    ]);
    await this.recoverFromVignette(expectedPath);
    await this.recoverFromHeavyLoad(expectedPath);
    if (expectedPath !== '/' && !this.page.url().includes(expectedPath)) {
      await this.navigateTo(expectedPath);
    }
  }

  async goToHome() {
    await this.clickNavLink(this.homeNavLink, '/');
  }

  async goToProducts() {
    await this.clickNavLink(this.productsNavLink, '/products');
  }

  async goToCart() {
    await this.clickNavLink(this.cartNavLink, '/view_cart');
  }

  async goToLogin() {
    await this.clickNavLink(this.signupLoginNavLink, '/login');
  }

  async goToTestCases() {
    await this.clickNavLink(this.testCasesNavLink, '/test_cases');
  }

  async goToApiTesting() {
    await this.clickNavLink(this.apiTestingNavLink, '/api_list');
  }

  async goToContactUs() {
    await this.clickNavLink(this.contactUsNavLink, '/contact_us');
  }

  async clickLogout() {
    await this.clickNavLink(this.logoutNavLink, '/login');
  }

  async clickDeleteAccount() {
    await this.clickNavLink(this.deleteAccountNavLink, '/delete_account');
  }

  async subscribeToNewsletter(email) {
    await this.footer.scrollIntoViewIfNeeded();
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionSubmitButton.click();
  }

  async isControlValid(locator) {
    return locator.evaluate((el) => el.checkValidity());
  }
}

module.exports = { BasePage };
