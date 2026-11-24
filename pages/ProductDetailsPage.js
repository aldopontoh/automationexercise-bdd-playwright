const { BasePage } = require('./BasePage');

class ProductDetailsPage extends BasePage {
  constructor(page) {
    super(page);

    this.productInfo = page.locator('.product-information');
    this.productName = this.productInfo.locator('h2');
    this.productPrice = this.productInfo.locator('span > span');
    this.quantityInput = page.locator('#quantity');
    this.addToCartButton = page.getByRole('button', { name: /Add to cart/i });

    // Cart modal shared on details page
    this.cartModal = page.locator('#cartModal');
    this.viewCartModalLink = this.cartModal.getByRole('link', { name: 'View Cart' });
    this.continueShoppingButton = this.cartModal.getByRole('button', { name: 'Continue Shopping' });

    // Write Your Review section
    this.reviewHeading = page.getByRole('link', { name: /Write Your Review/i });
    this.reviewNameInput = page.getByPlaceholder('Your Name');
    this.reviewEmailInput = page.getByPlaceholder('Email Address', { exact: true });
    this.reviewBodyInput = page.getByPlaceholder('Add Review Here!');
    this.reviewSubmitButton = page.getByRole('button', { name: 'Submit' });
    this.reviewSuccessAlert = page.locator('#review-section .alert-success');
  }

  async openProduct(productId) {
    await this.navigateTo(`/product_details/${productId}`);
  }

  async setQuantity(qty) {
    await this.quantityInput.fill(String(qty));
  }

  async addToCartWithQuantity(qty) {
    await this.setQuantity(qty);
    await this.addToCartButton.click();
  }

  async openCartFromModal() {
    await this.viewCartModalLink.click();
    await this.recoverFromVignette('/view_cart');
  }

  async submitReview({ name, email, review }) {
    await this.reviewNameInput.scrollIntoViewIfNeeded();
    await this.reviewNameInput.fill(name);
    await this.reviewEmailInput.fill(email);
    await this.reviewBodyInput.fill(review);
    await this.reviewSubmitButton.click();
  }
}

module.exports = { ProductDetailsPage };
