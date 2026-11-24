const { BasePage } = require('./BasePage');

class SignupFormPage extends BasePage {
  constructor(page) {
    super(page);

    this.accountInfoHeading = page.getByRole('heading', { name: /Enter Account Information/i });
    this.titleMrRadio = page.getByLabel('Mr.');
    this.titleMrsRadio = page.getByLabel('Mrs.');
    this.nameInput = page.locator('#name');
    this.emailInput = page.locator('#email');
    this.passwordInput = page.getByLabel(/Password/i);
    this.daysSelect = page.locator('#days');
    this.monthsSelect = page.locator('#months');
    this.yearsSelect = page.locator('#years');
    this.newsletterCheckbox = page.getByLabel(/Sign up for our newsletter!/i);
    this.optinCheckbox = page.getByLabel(/Receive special offers from our partners!/i);

    // Address information (#zipcode has no <label for="zipcode"> in live DOM)
    this.firstNameInput = page.getByLabel(/First name/i);
    this.lastNameInput = page.getByLabel(/Last name/i);
    this.companyInput = page.locator('#company');
    this.address1Input = page.locator('#address1');
    this.address2Input = page.locator('#address2');
    this.countrySelect = page.getByLabel(/Country/i);
    this.stateInput = page.getByLabel(/State/i);
    this.cityInput = page.locator('#city');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.getByLabel(/Mobile Number/i);

    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    this.accountCreatedHeading = page.getByRole('heading', { name: /Account Created!/i });

    // Recovery locators when POST /signup hits AUT heavy-load queue-full page
    this.signupForm = page.locator('.signup-form');
    this.signupNameInput = this.signupForm.getByPlaceholder('Name');
    this.signupEmailInput = this.signupForm.getByPlaceholder('Email Address');
    this.signupButton = this.signupForm.getByRole('button', { name: 'Signup' });
    this.signupErrorMessage = this.signupForm.locator('p');
    this.loginForm = page.locator('.login-form');
    this.loginEmailInput = this.loginForm.getByPlaceholder('Email Address');
    this.loginPasswordInput = this.loginForm.getByPlaceholder('Password');
    this.loginButton = this.loginForm.getByRole('button', { name: 'Login' });
  }

  async fillFormFields(user) {
    if (user.title === 'Mrs') {
      await this.titleMrsRadio.check();
    } else {
      await this.titleMrRadio.check();
    }

    await this.passwordInput.fill(user.password);
    await this.daysSelect.selectOption(user.day);
    await this.monthsSelect.selectOption(user.month);
    await this.yearsSelect.selectOption(user.year);

    if (user.newsletter) {
      await this.newsletterCheckbox.check();
    }
    if (user.optin) {
      await this.optinCheckbox.check();
    }

    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.companyInput.fill(user.company);
    await this.address1Input.fill(user.address1);
    await this.address2Input.fill(user.address2);
    await this.countrySelect.selectOption(user.country);
    await this.stateInput.fill(user.state);
    await this.cityInput.fill(user.city);
    await this.zipcodeInput.fill(user.zipcode);
    await this.mobileNumberInput.fill(user.mobileNumber);
  }

  async restartSignupFromLogin(user) {
    await this.navigateTo('/login');
    await this.signupNameInput.fill(user.name);
    await this.signupEmailInput.fill(user.email);
    await this.signupButton.click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await this.recoverFromVignette('/signup');

    // If the earlier heavy-load POST actually persisted the account, clean it up cleanly first
    const alreadyExists = await this.signupErrorMessage
      .filter({ hasText: /already exist/i })
      .isVisible()
      .catch(() => false);
    if (alreadyExists) {
      await this.loginEmailInput.fill(user.email);
      await this.loginPasswordInput.fill(user.password);
      await this.loginButton.click();
      await this.page.waitForLoadState('domcontentloaded').catch(() => {});
      await this.recoverFromHeavyLoad('/');
      if (await this.deleteAccountNavLink.isVisible().catch(() => false)) {
        await this.clickDeleteAccount();
      }
      await this.navigateTo('/login');
      await this.signupNameInput.fill(user.name);
      await this.signupEmailInput.fill(user.email);
      await this.signupButton.click();
      await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    }
  }

  async fillAndSubmitRegistration(user, maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      await this.fillFormFields(user);
      await Promise.all([
        this.page
          .waitForURL(
            (url) =>
              url.pathname === '/account_created' || url.hash.includes('google_vignette'),
            { waitUntil: 'domcontentloaded', timeout: 30000 }
          )
          .catch(() => {}),
        this.createAccountButton.click(),
      ]);
      await this.recoverFromVignette('/account_created');

      const created = await this.accountCreatedHeading
        .waitFor({ state: 'visible', timeout: 6000 })
        .then(() => true)
        .catch(() => false);
      if (created) {
        return;
      }

      if (attempt < maxAttempts && (await this.isHeavyLoadPage())) {
        await this.restartSignupFromLogin(user);
        await this.accountInfoHeading.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
      } else {
        return;
      }
    }
  }
}

module.exports = { SignupFormPage };
