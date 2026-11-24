@catalog-search
Feature: Catalog, Search & Product Details
  As a shopper browsing Automation Exercise
  I want to search, filter by category or brand, view product metadata, and post reviews
  So that I can confidently select products before adding them to my cart

  Background:
    Given I am on the All Products catalog page

  @smoke @P0 @TC-CAT-01 @AE-TC-08
  Scenario: Verify All Products catalog listing and search bar
    Then the catalog page should display title, search bar, and 34 products

  @smoke @P0 @TC-CAT-02 @AE-TC-09
  Scenario: Search catalog with a valid matching keyword
    When I search the catalog for "Top"
    Then I should see the Searched Products heading with matching results including "Blue Top"

  @regression @P1 @TC-CAT-03
  Scenario: Search catalog with a non-matching keyword yields zero results
    When I search the catalog for "NonExistentZebraItem999"
    Then I should see the Searched Products heading with zero product results

  @regression @P1 @TC-CAT-04 @AE-TC-18
  Scenario: Filter catalog products by sidebar category and subcategory
    When I filter products by category "Women" and subcategory "Dress"
    Then I should see the filtered category heading matching "Women\s*-\s*Dress Products" with 3 products

  @regression @P1 @TC-CAT-05 @AE-TC-19
  Scenario: Filter catalog products by sidebar brand
    When I filter products by brand "Polo"
    Then I should see the filtered brand heading matching "Brand\s*-\s*Polo Products" with 6 products

  @regression @P1 @TC-CAT-06 @AE-TC-08 @AE-TC-21
  Scenario: Inspect product details metadata and submit a valid product review
    When I open product details for product ID 1
    Then the product details page should display metadata for "Blue Top" priced at "Rs. 500"
    When I submit a valid product review on the product details page
    Then I should see the product review confirmation message
