const { BasePage } = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);

    this.addressDetailsHeading = page.getByRole('heading', { name: 'Address Details' });
    this.reviewOrderHeading = page.getByRole('heading', { name: 'Review Your Order' });
    this.deliveryAddressBlock = page.locator('#address_delivery');
    this.billingAddressBlock = page.locator('#address_invoice');
    this.orderReviewTable = page.locator('#cart_info');
    this.grandTotalPrice = this.orderReviewTable.locator('.cart_total_price').last();
    this.orderCommentTextarea = page.locator('#ordermsg textarea[name="message"]');
    this.placeOrderLink = page.getByRole('link', { name: 'Place Order' });
  }

  async open() {
    await this.navigateTo('/checkout');
  }

  async enterOrderComment(comment) {
    await this.orderCommentTextarea.scrollIntoViewIfNeeded();
    await this.orderCommentTextarea.fill(comment);
  }

  async clickPlaceOrder() {
    await this.placeOrderLink.scrollIntoViewIfNeeded();
    await this.placeOrderLink.click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await this.recoverFromVignette('/payment');
    await this.recoverFromHeavyLoad('/payment');
  }
}

module.exports = { CheckoutPage };
