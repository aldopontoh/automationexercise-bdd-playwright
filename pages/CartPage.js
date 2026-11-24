const { BasePage } = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);

    this.emptyCartBanner = page.locator('#empty_cart');
    this.emptyCartProductsLink = this.emptyCartBanner.getByRole('link', { name: /here/i });
    this.cartTableRows = page.locator('#cart_info_table tbody tr');
    this.proceedToCheckoutButton = page.locator('a.check_out');

    // Guest checkout prompt modal
    this.checkoutModal = page.locator('#checkoutModal');
    this.checkoutModalRegisterLoginLink = this.checkoutModal.getByRole('link', {
      name: /Register \/ Login/i,
    });
    this.checkoutModalContinueButton = this.checkoutModal.getByRole('button', {
      name: /Continue On Cart/i,
    });
  }

  async open() {
    await this.navigateTo('/view_cart');
  }

  getProductRow(productId) {
    return this.page.locator(`#product-${productId}`);
  }

  getProductNameCell(productId) {
    return this.getProductRow(productId).locator('.cart_description h4 a');
  }

  getProductPriceCell(productId) {
    return this.getProductRow(productId).locator('.cart_price p');
  }

  getProductQuantityCell(productId) {
    return this.getProductRow(productId).locator('.cart_quantity button');
  }

  getProductTotalCell(productId) {
    return this.getProductRow(productId).locator('.cart_total p');
  }

  async removeProductById(productId) {
    await this.getProductRow(productId).locator('.cart_delete a').click();
  }

  async clickProceedToCheckout() {
    await this.proceedToCheckoutButton.click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await this.recoverFromVignette(this.page.url());
    await this.recoverFromHeavyLoad(this.page.url());
  }

  async clickRegisterLoginInModal() {
    await this.checkoutModalRegisterLoginLink.click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await this.recoverFromVignette('/login');
    await this.recoverFromHeavyLoad('/login');
  }

  async clickContinueOnCartInModal() {
    await this.checkoutModalContinueButton.click();
  }

  async clickEmptyCartProductsLink() {
    await this.emptyCartProductsLink.click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await this.recoverFromVignette('/products');
    await this.recoverFromHeavyLoad('/products');
  }
}

module.exports = { CartPage };
