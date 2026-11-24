const fs = require('node:fs');
const { BasePage } = require('./BasePage');

class PaymentPage extends BasePage {
  constructor(page) {
    super(page);

    this.paymentHeading = page.getByRole('heading', { name: 'Payment' });
    this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcInput = page.getByPlaceholder('ex. 311');
    this.expiryMonthInput = page.getByPlaceholder('MM');
    this.expiryYearInput = page.getByPlaceholder('YYYY');
    this.payAndConfirmButton = page.getByRole('button', { name: 'Pay and Confirm Order' });

    // Order confirmation (/payment_done/<amount>)
    this.orderPlacedHeading = page.getByRole('heading', { name: /Order Placed!/i });
    this.orderConfirmedMessage = page.getByText(/Congratulations! Your order has been confirmed!/i);
    this.downloadInvoiceLink = page.getByRole('link', { name: /Download Invoice/i });
    this.continueButton = page.locator('[data-qa="continue-button"]');
  }

  async open() {
    await this.navigateTo('/payment');
  }

  async fillPaymentDetails({ nameOnCard, cardNumber, cvc, expiryMonth, expiryYear }) {
    await this.nameOnCardInput.fill(nameOnCard);
    await this.cardNumberInput.fill(cardNumber);
    await this.cvcInput.fill(cvc);
    await this.expiryMonthInput.fill(expiryMonth);
    await this.expiryYearInput.fill(expiryYear);
  }

  async submitPayment() {
    await this.payAndConfirmButton.click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await this.recoverFromHeavyLoad(this.page.url());
  }

  async downloadInvoice() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadInvoiceLink.click(),
    ]);
    const filePath = await download.path();
    const suggestedFilename = download.suggestedFilename();
    const content = filePath ? fs.readFileSync(filePath, 'utf-8') : '';
    return { suggestedFilename, content };
  }

  async clickContinue() {
    await this.continueButton.click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await this.recoverFromVignette('/');
    await this.recoverFromHeavyLoad('/');
  }
}

module.exports = { PaymentPage };
