const { expect } = require('@playwright/test');
const { Given, When, Then } = require('../fixtures/bddFixtures');
const { createContactMessage } = require('../utils/testDataFactory');

Given('I am on the Contact Us page', async ({ contactUsPage }) => {
  await contactUsPage.open();
});

Then('the Contact Us page should display its title, headings, and form controls', async ({ page, contactUsPage }) => {
  await expect(page).toHaveTitle('Automation Exercise - Contact Us');
  await expect(contactUsPage.getInTouchHeading).toBeVisible();
  await expect(contactUsPage.feedbackHeading).toBeVisible();
  await expect(contactUsPage.nameInput).toBeVisible();
  await expect(contactUsPage.emailInput).toBeVisible();
  await expect(contactUsPage.subjectInput).toBeVisible();
  await expect(contactUsPage.messageTextarea).toBeVisible();
  await expect(contactUsPage.fileUploadInput).toBeVisible();
  await expect(contactUsPage.submitButton).toBeVisible();
});

When('I submit the Contact Us form with valid details and an uploaded fixture file', async ({ contactUsPage }) => {
  await contactUsPage.fillForm(createContactMessage());
  await contactUsPage.attachFixtureFile('test-data/sample-contact-upload.txt');
  await contactUsPage.submitAcceptingDialog();
});

Then('I should see the Contact Us submission success banner', async ({ contactUsPage }) => {
  await expect(contactUsPage.successAlert).toBeVisible();
  await expect(contactUsPage.successAlert).toContainText(
    'Success! Your details have been submitted successfully.'
  );
});

When('I click the return Home button on the Contact Us confirmation state', async ({ contactUsPage }) => {
  await contactUsPage.clickReturnHome();
});

Then('I should be returned to the Automation Exercise home page', async ({ page }) => {
  await expect(page).toHaveURL(/\/$/);
  await expect(page).toHaveTitle('Automation Exercise');
});

When('I attempt to submit the Contact Us form without an email address', async ({ contactUsPage }) => {
  const payload = createContactMessage();
  await contactUsPage.fillForm({
    name: payload.name,
    email: '',
    subject: payload.subject,
    message: payload.message,
  });
  await contactUsPage.clickSubmitRaw();
});

Then('the Contact Us email field should fail HTML5 validation', async ({ contactUsPage }) => {
  const isValid = await contactUsPage.isControlValid(contactUsPage.emailInput);
  expect(isValid).toBe(false);
  await expect(contactUsPage.successAlert).not.toBeVisible();
});
