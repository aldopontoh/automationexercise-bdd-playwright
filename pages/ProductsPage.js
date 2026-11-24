const { BasePage } = require('./BasePage');

class ProductsPage extends BasePage {
  constructor(page) {
    super(page);

    this.catalogHeading = page.locator('.features_items h2.title');
    this.searchInput = page.getByPlaceholder('Search Product');
    this.searchSubmitButton = page.locator('#submit_search');
    this.productCards = page.locator('.features_items .product-image-wrapper');
    this.productTitles = page.locator('.features_items .productinfo p');
    this.categoryAccordion = page.locator('#accordian');
    this.brandsSidebar = page.locator('.brands_products');

    // Add-to-cart confirmation modal
    this.cartModal = page.locator('#cartModal');
    this.cartModalHeading = this.cartModal.getByRole('heading', { name: /Added!/i });
    this.continueShoppingButton = this.cartModal.getByRole('button', { name: 'Continue Shopping' });
    this.viewCartModalLink = this.cartModal.getByRole('link', { name: 'View Cart' });
  }

  async open() {
    await this.navigateTo('/products');
  }

  async searchProduct(keyword) {
    await this.searchInput.fill(keyword);
    await this.searchSubmitButton.click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await this.recoverFromHeavyLoad(`/products?search=${encodeURIComponent(keyword)}`);
  }

  async selectCategory(parentCategory, subCategory) {
    const parentToggle = this.categoryAccordion.locator(`a[href="#${parentCategory}"]`);
    await parentToggle.click();
    const subLink = this.categoryAccordion
      .locator(`#${parentCategory}`)
      .getByRole('link', { name: new RegExp(`^\\s*${subCategory}\\s*$`, 'i') });
    await subLink.click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await this.recoverFromVignette(this.page.url());
    await this.recoverFromHeavyLoad(this.page.url());
  }

  async selectBrand(brandName) {
    const brandLink = this.brandsSidebar.getByRole('link', {
      name: new RegExp(brandName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
    });
    await brandLink.click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    const targetPath = `/brand_products/${encodeURIComponent(brandName)}`;
    await this.recoverFromVignette(targetPath);
    await this.recoverFromHeavyLoad(targetPath);
  }

  async addProductById(productId, maxAttempts = 3) {
    const addButton = this.page.locator(
      `.features_items .productinfo a.add-to-cart[data-product-id="${productId}"]`
    );
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      await this.page.waitForLoadState('load').catch(() => {});
      await addButton.scrollIntoViewIfNeeded();
      const responsePromise = this.page
        .waitForResponse((res) => res.url().includes(`/add_to_cart/${productId}`), {
          timeout: 8000,
        })
        .catch(() => null);
      await addButton.click();
      const response = await responsePromise;
      const responseOk = !response || response.ok();
      const modalVisible = await this.cartModal
        .waitFor({ state: 'visible', timeout: 5000 })
        .then(() => true)
        .catch(() => false);
      if (responseOk && modalVisible) {
        return;
      }
      if (attempt < maxAttempts) {
        const currentPath = new URL(this.page.url()).pathname + new URL(this.page.url()).search;
        await this.navigateTo(currentPath || '/products');
      }
    }
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async openCartFromModal() {
    await Promise.all([
      this.page
        .waitForURL(
          (url) => url.pathname === '/view_cart' || url.hash.includes('google_vignette'),
          { waitUntil: 'domcontentloaded', timeout: 30000 }
        )
        .catch(() => {}),
      this.viewCartModalLink.click(),
    ]);
    await this.recoverFromVignette('/view_cart');
    await this.recoverFromHeavyLoad('/view_cart');
  }

  async openProductDetailsById(productId) {
    const targetPath = `/product_details/${productId}`;
    const viewLink = this.page.locator(`a[href="${targetPath}"]`).first();
    await viewLink.scrollIntoViewIfNeeded();
    await Promise.all([
      this.page
        .waitForURL(
          (url) => url.pathname === targetPath || url.hash.includes('google_vignette'),
          { waitUntil: 'domcontentloaded', timeout: 30000 }
        )
        .catch(() => {}),
      viewLink.click(),
    ]);
    await this.recoverFromVignette(targetPath);
    await this.recoverFromHeavyLoad(targetPath);
  }
}

module.exports = { ProductsPage };
