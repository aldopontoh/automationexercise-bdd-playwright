const crypto = require('node:crypto');

function uniqueToken() {
  const ts = Date.now().toString(36);
  const rand = crypto.randomBytes(3).toString('hex');
  return `${ts}${rand}`;
}

function createUser(overrides = {}) {
  const token = uniqueToken();
  return {
    title: 'Mr',
    name: `QA User ${token}`,
    email: `qa.ae.${token}@example.com`,
    password: `QaPass!${token}`,
    day: '15',
    month: 'June',
    year: '1995',
    newsletter: true,
    optin: true,
    firstName: 'Aldo',
    lastName: `Tester${token.slice(-4)}`,
    company: 'QA Automation Labs',
    address1: '742 Evergreen Terrace',
    address2: 'Suite 400',
    country: 'United States',
    state: 'California',
    city: 'San Francisco',
    zipcode: '94105',
    mobileNumber: '5550192834',
    ...overrides,
  };
}

function createSubscriptionEmail() {
  return `qa.sub.${uniqueToken()}@example.com`;
}

function createProductReview() {
  const token = uniqueToken();
  return {
    name: `QA Reviewer ${token.slice(-4)}`,
    email: `qa.rev.${token}@example.com`,
    review: 'Automated QA verification review: product details and quality verified.',
  };
}

function createContactMessage() {
  const token = uniqueToken();
  return {
    name: `QA Contact ${token.slice(-4)}`,
    email: `qa.cnt.${token}@example.com`,
    subject: `Automated Inquiry ${token.slice(-4)}`,
    message: 'Safe synthetic QA test inquiry verifying Contact Us form and attachment upload.',
  };
}

function createDummyPayment() {
  return {
    nameOnCard: 'QA Sandbox Card',
    cardNumber: '0000000000000000',
    cvc: '123',
    expiryMonth: '12',
    expiryYear: '2030',
  };
}

module.exports = {
  uniqueToken,
  createUser,
  createSubscriptionEmail,
  createProductReview,
  createContactMessage,
  createDummyPayment,
};
