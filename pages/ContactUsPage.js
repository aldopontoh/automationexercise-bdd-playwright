const path = require('node:path');
const { BasePage } = require('./BasePage');

class ContactUsPage extends BasePage {
  constructor(page) {
    super(page);

    this.getInTouchHeading = page.getByRole('heading', { name: /Get In Touch/i });
    this.feedbackHeading = page.getByRole('heading', { name: /Feedback For Us/i });
    this.nameInput = page.getByPlaceholder('Name');
    this.emailInput = page.getByPlaceholder('Email', { exact: true });
    this.subjectInput = page.getByPlaceholder('Subject');
    this.messageTextarea = page.getByPlaceholder('Your Message Here');
    this.fileUploadInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.successAlert = page.locator('#contact-page .status.alert-success');
    this.returnHomeButton = page.locator('#form-section').getByRole('link', { name: /Home/i });
  }

  async open() {
    await this.navigateTo('/contact_us');
  }

  async fillForm({ name, email, subject, message }) {
    if (name !== undefined) await this.nameInput.fill(name);
    if (email !== undefined) await this.emailInput.fill(email);
    if (subject !== undefined) await this.subjectInput.fill(subject);
    if (message !== undefined) await this.messageTextarea.fill(message);
  }

  async attachFixtureFile(relativePathFromRoot) {
    const absoluteFile = path.resolve(process.cwd(), relativePathFromRoot);
    await this.fileUploadInput.setInputFiles(absoluteFile);
  }

  async submitAcceptingDialog() {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.submitButton.click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  }

  async clickSubmitRaw() {
    await this.submitButton.click();
  }

  async clickReturnHome() {
    await Promise.all([
      this.page
        .waitForURL(
          (url) => url.pathname === '/' || url.hash.includes('google_vignette'),
          { waitUntil: 'domcontentloaded', timeout: 30000 }
        )
        .catch(() => {}),
      this.returnHomeButton.click(),
    ]);
    await this.recoverFromVignette('/');
    await this.recoverFromHeavyLoad('/');
  }
}

module.exports = { ContactUsPage };
