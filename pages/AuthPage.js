const { BasePage } = require('./BasePage');

class AuthPage extends BasePage {
  constructor(page) {
    super(page);

    // Login form (scoped semantically to .login-form)
    this.loginForm = page.locator('.login-form');
    this.loginHeading = this.loginForm.getByRole('heading', { name: /Login to your account/i });
    this.loginEmailInput = this.loginForm.getByPlaceholder('Email Address');
    this.loginPasswordInput = this.loginForm.getByPlaceholder('Password');
    this.loginButton = this.loginForm.getByRole('button', { name: 'Login' });
    this.loginErrorMessage = this.loginForm.locator('p');

    // Signup form (scoped semantically to .signup-form)
    this.signupForm = page.locator('.signup-form');
    this.signupHeading = this.signupForm.getByRole('heading', { name: /New User Signup!/i });
    this.signupNameInput = this.signupForm.getByPlaceholder('Name');
    this.signupEmailInput = this.signupForm.getByPlaceholder('Email Address');
    this.signupButton = this.signupForm.getByRole('button', { name: 'Signup' });
    this.signupErrorMessage = this.signupForm.locator('p');

    // Account created / deleted confirmation banners
    this.accountCreatedHeading = page.getByRole('heading', { name: /Account Created!/i });
    this.accountDeletedHeading = page.getByRole('heading', { name: /Account Deleted!/i });
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  async open(maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      await this.navigateTo('/login');
      const mounted = await this.loginForm
        .waitFor({ state: 'visible', timeout: 8000 })
        .then(() => true)
        .catch(() => false);
      if (mounted) {
        return;
      }
    }
  }

  async login(email, password, maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const formReady = await this.loginEmailInput.isVisible().catch(() => false);
      if (!formReady) {
        await this.open();
      }
      await this.loginEmailInput.fill(email);
      await this.loginPasswordInput.fill(password);
      await this.loginButton.click();
      await this.page.waitForLoadState('domcontentloaded').catch(() => {});
      await this.recoverFromVignette('/');
      if (!(await this.isHeavyLoadPage())) {
        return;
      }
      if (attempt < maxAttempts) {
        await this.open();
      }
    }
  }

  async startSignup(name, email, maxAttempts = 3) {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const formReady = await this.signupNameInput.isVisible().catch(() => false);
      if (!formReady) {
        await this.open();
      }
      await this.signupNameInput.fill(name);
      await this.signupEmailInput.fill(email);
      await this.signupButton.click();
      await this.page.waitForLoadState('domcontentloaded').catch(() => {});
      await this.recoverFromVignette('/signup');
      if (!(await this.isHeavyLoadPage())) {
        return;
      }
      if (attempt < maxAttempts) {
        await this.open();
      }
    }
  }

  async clickContinue() {
    await Promise.all([
      this.page
        .waitForURL(
          (url) => url.pathname === '/' || url.hash.includes('google_vignette'),
          { waitUntil: 'domcontentloaded', timeout: 30000 }
        )
        .catch(() => {}),
      this.continueButton.click(),
    ]);
    await this.recoverFromVignette('/');
    await this.recoverFromHeavyLoad('/');
  }
}

module.exports = { AuthPage };
