const { expect } = require('@playwright/test');
const { Given, When, Then } = require('../fixtures/bddFixtures');
const { createProductReview } = require('../utils/testDataFactory');

Given('I am on the All Products catalog page', async ({ productsPage }) => {
  await productsPage.open();
});

Then('the catalog page should display title, search bar, and {int} products', async ({ page, productsPage }, expectedCount) => {
  await expect(page).toHaveTitle('Automation Exercise - All Products');
  await expect(productsPage.catalogHeading).toHaveText(/All Products/i);
  await expect(productsPage.searchInput).toBeVisible();
  await expect(productsPage.productCards).toHaveCount(expectedCount);
});

When('I search the catalog for {string}', async ({ productsPage }, keyword) => {
  await productsPage.searchProduct(keyword);
});

Then('I should see the Searched Products heading with matching results including {string}', async ({ productsPage }, expectedProduct) => {
  await expect(productsPage.catalogHeading).toHaveText(/Searched Products/i);
  const count = await productsPage.productCards.count();
  expect(count).toBeGreaterThan(0);
  await expect(productsPage.productTitles.filter({ hasText: expectedProduct }).first()).toBeVisible();
});

Then('I should see the Searched Products heading with zero product results', async ({ productsPage }) => {
  await expect(productsPage.catalogHeading).toHaveText(/Searched Products/i);
  await expect(productsPage.productCards).toHaveCount(0);
});

When('I filter products by category {string} and subcategory {string}', async ({ productsPage }, parentCategory, subCategory) => {
  await productsPage.selectCategory(parentCategory, subCategory);
});

Then('I should see the filtered category heading matching {string} with {int} products', async ({ productsPage }, expectedPattern, expectedCount) => {
  await expect(productsPage.catalogHeading).toHaveText(new RegExp(expectedPattern, 'i'));
  await expect(productsPage.productCards).toHaveCount(expectedCount);
});

When('I filter products by brand {string}', async ({ productsPage }, brandName) => {
  await productsPage.selectBrand(brandName);
});

Then('I should see the filtered brand heading matching {string} with {int} products', async ({ productsPage }, expectedPattern, expectedCount) => {
  await expect(productsPage.catalogHeading).toHaveText(new RegExp(expectedPattern, 'i'));
  await expect(productsPage.productCards).toHaveCount(expectedCount);
});

When('I open product details for product ID {int}', async ({ productsPage }, productId) => {
  await productsPage.openProductDetailsById(productId);
});

Then('the product details page should display metadata for {string} priced at {string}', async ({ page, productDetailsPage }, productName, expectedPrice) => {
  await expect(page).toHaveTitle('Automation Exercise - Product Details');
  await expect(productDetailsPage.productName).toHaveText(productName);
  await expect(productDetailsPage.productPrice).toHaveText(expectedPrice);
  await expect(productDetailsPage.productInfo).toContainText('Category: Women > Tops');
  await expect(productDetailsPage.productInfo).toContainText('Availability: In Stock');
  await expect(productDetailsPage.productInfo).toContainText('Condition: New');
  await expect(productDetailsPage.productInfo).toContainText('Brand: Polo');
});

When('I submit a valid product review on the product details page', async ({ productDetailsPage }) => {
  await expect(productDetailsPage.reviewHeading).toBeVisible();
  await productDetailsPage.submitReview(createProductReview());
});

Then('I should see the product review confirmation message', async ({ productDetailsPage }) => {
  await expect(productDetailsPage.reviewSuccessAlert).toBeVisible();
  await expect(productDetailsPage.reviewSuccessAlert).toContainText('Thank you for your review.');
});
