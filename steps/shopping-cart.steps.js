const { expect } = require('@playwright/test');
const { Given, When, Then } = require('../fixtures/bddFixtures');

Given('I open the shopping cart page with an empty session', async ({ cartPage }) => {
  await cartPage.open();
});

Then('I should see the empty cart banner and be able to navigate to Products', async ({ page, cartPage }) => {
  await expect(cartPage.emptyCartBanner).toBeVisible();
  await expect(cartPage.emptyCartBanner).toContainText('Cart is empty!');
  await cartPage.clickEmptyCartProductsLink();
  await expect(page).toHaveURL(/\/products$/);
});

When('I add product {int} and product {int} to the cart from the catalog', async ({ productsPage }, firstId, secondId) => {
  await productsPage.addProductById(firstId);
  await expect(productsPage.cartModal).toBeVisible();
  await expect(productsPage.cartModalHeading).toBeVisible();
  await productsPage.continueShopping();

  await productsPage.addProductById(secondId);
  await expect(productsPage.cartModal).toBeVisible();
  await productsPage.openCartFromModal();
});

Then('the cart table should contain {int} items with accurate prices and totals', async ({ cartPage }, expectedRows) => {
  await expect(cartPage.cartTableRows).toHaveCount(expectedRows);
  await expect(cartPage.getProductNameCell(1)).toHaveText('Blue Top');
  await expect(cartPage.getProductPriceCell(1)).toHaveText('Rs. 500');
  await expect(cartPage.getProductQuantityCell(1)).toHaveText('1');
  await expect(cartPage.getProductTotalCell(1)).toHaveText('Rs. 500');

  await expect(cartPage.getProductNameCell(2)).toContainText(/Men\s+Tshirt/i);
  await expect(cartPage.getProductPriceCell(2)).toHaveText('Rs. 400');
  await expect(cartPage.getProductQuantityCell(2)).toHaveText('1');
  await expect(cartPage.getProductTotalCell(2)).toHaveText('Rs. 400');
});

When('I add product {int} with quantity {int} from the product details page', async ({ productDetailsPage }, productId, quantity) => {
  await productDetailsPage.openProduct(productId);
  await productDetailsPage.addToCartWithQuantity(quantity);
  await expect(productDetailsPage.cartModal).toBeVisible();
  await productDetailsPage.openCartFromModal();
});

Then('product {int} in the cart should display quantity {string} and total {string}', async ({ cartPage }, productId, expectedQty, expectedTotal) => {
  await expect(cartPage.getProductQuantityCell(productId)).toHaveText(expectedQty);
  await expect(cartPage.getProductTotalCell(productId)).toHaveText(expectedTotal);
});

Given('I have added product {int} to the shopping cart', async ({ productsPage }, productId) => {
  await productsPage.open();
  await productsPage.addProductById(productId);
  await expect(productsPage.cartModal).toBeVisible();
  await productsPage.openCartFromModal();
});

When('I remove product {int} from the shopping cart', async ({ cartPage }, productId) => {
  await expect(cartPage.getProductRow(productId)).toBeVisible();
  await cartPage.removeProductById(productId);
});

Then('the shopping cart should transition back to the empty state', async ({ cartPage }) => {
  await expect(cartPage.emptyCartBanner).toBeVisible();
  await expect(cartPage.emptyCartBanner).toContainText('Cart is empty!');
});

When('I click Proceed To Checkout as a guest shopper', async ({ cartPage }) => {
  await cartPage.clickProceedToCheckout();
});

Then('I should see the guest checkout login modal and remain on the cart after dismissing it', async ({ page, cartPage }) => {
  await expect(cartPage.checkoutModal).toBeVisible();
  await expect(cartPage.checkoutModal).toContainText('Register / Login account to proceed on checkout.');
  await expect(cartPage.checkoutModalRegisterLoginLink).toHaveAttribute('href', '/login');
  await cartPage.clickContinueOnCartInModal();
  await expect(cartPage.checkoutModal).not.toBeVisible();
  await expect(page).toHaveURL(/\/view_cart$/);
});

When('I search for {string}, add product {int} to the cart, and log in with the ephemeral user', async ({ productsPage, cartPage, authPage, testContext }, keyword, productId) => {
  await productsPage.open();
  await productsPage.searchProduct(keyword);
  await expect(productsPage.catalogHeading).toHaveText(/Searched Products/i);
  await productsPage.addProductById(productId);
  await expect(productsPage.cartModal).toBeVisible();
  await productsPage.openCartFromModal();
  await expect(cartPage.getProductRow(productId)).toBeVisible();

  await authPage.goToLogin();
  await authPage.login(testContext.createdUser.email, testContext.createdUser.password);
  await expect(authPage.loggedInAsBadge).toContainText(testContext.createdUser.name);
  await cartPage.goToCart();
});

Then('product {int} should remain persisted in the shopping cart after login', async ({ cartPage }, productId) => {
  await expect(cartPage.getProductRow(productId)).toBeVisible();
  await expect(cartPage.getProductNameCell(productId)).toHaveText('Blue Top');
});

When('I add an active recommended item from the home page to the shopping cart', async ({ homePage, testContext }) => {
  await expect(homePage.recommendedItemsHeading).toBeVisible();
  const addedItem = await homePage.addFirstActiveRecommendedItem();
  testContext.recommendedItem = addedItem;
  await expect(homePage.cartModal).toBeVisible();
  await homePage.openCartFromModal();
});

Then('the added recommended item should be visible in the shopping cart', async ({ cartPage, testContext }) => {
  const { productId, productName } = testContext.recommendedItem;
  await expect(cartPage.getProductRow(productId)).toBeVisible();
  await expect(cartPage.getProductNameCell(productId)).toContainText(productName);
});
