const { expect } = require('@playwright/test');
const { Given, When, Then } = require('../fixtures/bddFixtures');
const { createUser } = require('../utils/testDataFactory');

Given('I am on the Signup and Login page', async ({ authPage }) => {
  await authPage.open();
  await expect(authPage.loginHeading).toBeVisible();
  await expect(authPage.signupHeading).toBeVisible();
});

When('I register a new ephemeral user account', async ({ authPage, signupFormPage, testContext }) => {
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
});

Then('I should be logged in as the newly registered user', async ({ authPage, testContext }) => {
  await expect(authPage.loggedInAsBadge).toBeVisible();
  await expect(authPage.loggedInAsBadge).toContainText(testContext.createdUser.name);
});

When('I delete the currently logged-in account', async ({ authPage, testContext }) => {
  await authPage.clickDeleteAccount();
  testContext.accountDeleted = true;
});

Then('I should see the Account Deleted confirmation and return home', async ({ page, authPage }) => {
  await expect(authPage.accountDeletedHeading).toBeVisible();
  await authPage.clickContinue();
  await expect(page).toHaveURL(/\/$/);
});

When('I submit invalid login credentials {string} and {string}', async ({ authPage }, email, password) => {
  await authPage.login(email, password);
});

Then('I should see the incorrect login credentials error message', async ({ page, authPage }) => {
  await expect(page).toHaveURL(/\/login$/);
  await expect(authPage.loginErrorMessage).toBeVisible();
  await expect(authPage.loginErrorMessage).toContainText('Your email or password is incorrect!');
});

Given('an ephemeral user account has been registered and logged out', async ({ authPage, signupFormPage, testContext }) => {
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
  await expect(authPage.loggedInAsBadge).toBeVisible();
  await authPage.clickLogout();
});

When('I attempt to sign up again using the existing ephemeral email', async ({ authPage, testContext }) => {
  await authPage.startSignup(testContext.createdUser.name, testContext.createdUser.email);
});

Then('I should see the duplicate email registration error message', async ({ page, authPage }) => {
  await expect(page).toHaveURL(/\/(login|signup)$/);
  await expect(authPage.signupErrorMessage).toBeVisible();
  await expect(authPage.signupErrorMessage).toContainText('Email Address already exist!');
});

When('I log out and log back in with the ephemeral user credentials', async ({ page, authPage, testContext }) => {
  await authPage.clickLogout();
  await expect(page).toHaveURL(/\/login$/);
  await authPage.login(testContext.createdUser.email, testContext.createdUser.password);
});

When('I submit malformed or empty credentials on Login and Signup forms', async ({ authPage }) => {
  await authPage.loginEmailInput.fill('malformed-email-address');
  await authPage.loginPasswordInput.fill('');
  await authPage.loginButton.click();
});

Then('both Login and Signup forms should fail HTML5 native validation', async ({ page, authPage }) => {
  const loginEmailValid = await authPage.isControlValid(authPage.loginEmailInput);
  const loginPasswordValid = await authPage.isControlValid(authPage.loginPasswordInput);
  expect(loginEmailValid).toBe(false);
  expect(loginPasswordValid).toBe(false);

  await authPage.signupNameInput.fill('');
  await authPage.signupEmailInput.fill('');
  await authPage.signupButton.click();

  const signupNameValid = await authPage.isControlValid(authPage.signupNameInput);
  const signupEmailValid = await authPage.isControlValid(authPage.signupEmailInput);
  expect(signupNameValid).toBe(false);
  expect(signupEmailValid).toBe(false);
  await expect(page).toHaveURL(/\/login$/);
});
