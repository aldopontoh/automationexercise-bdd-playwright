const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);

    this.heroCarousel = page.locator('#slider-carousel');
    this.heroSlides = page.locator('#slider-carousel .item');
    this.activeHeroSubtitle = page.locator('#slider-carousel .item.active h2');
    this.featuresItemsHeading = page.getByRole('heading', { name: /Features Items/i });
    this.featuredProductCards = page.locator('.features_items .product-image-wrapper');
    this.categorySidebarHeading = page.getByRole('heading', { name: /^Category$/i });
    this.brandsSidebarHeading = page.getByRole('heading', { name: /^Brands$/i });

    // Recommended items section & cart modal
    this.recommendedItemsSection = page.locator('.recommended_items');
    this.recommendedItemsHeading = this.recommendedItemsSection.locator('h2.title');
    this.activeRecommendedCards = this.recommendedItemsSection.locator(
      '#recommended-item-carousel .item.active .product-image-wrapper'
    );
    this.cartModal = page.locator('#cartModal');
    this.viewCartModalLink = this.cartModal.getByRole('link', { name: 'View Cart' });

    // Floating scroll-up arrow
    this.scrollUpArrow = page.locator('#scrollUp');

    // Reference pages (/test_cases and /api_list)
    this.referencePageHeading = page.locator('h2.title');
    this.referenceAccordionPanels = page.locator('.panel-group .panel-title a');
  }

  async open() {
    await this.navigateTo('/');
  }

  async openTestCasesPage() {
    await this.navigateTo('/test_cases');
  }

  async openApiListPage() {
    await this.navigateTo('/api_list');
  }

  async scrollToBottom() {
    await this.footer.scrollIntoViewIfNeeded();
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  async clickScrollUpArrow() {
    await this.scrollUpArrow.click();
  }

  async scrollToTopManually() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async getScrollY() {
    return this.page.evaluate(() => window.scrollY);
  }

  async addFirstActiveRecommendedItem() {
    await this.recommendedItemsSection.scrollIntoViewIfNeeded();
    const firstActiveCard = this.activeRecommendedCards.first();
    const addButton = firstActiveCard.locator('a.add-to-cart');
    const productId = await addButton.getAttribute('data-product-id');
    const productName = (await firstActiveCard.locator('.productinfo p').textContent()).trim();
    await addButton.click();
    return { productId, productName };
  }

  async openCartFromModal() {
    await this.viewCartModalLink.click();
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await this.recoverFromVignette('/view_cart');
    await this.recoverFromHeavyLoad('/view_cart');
  }
}

module.exports = { HomePage };
