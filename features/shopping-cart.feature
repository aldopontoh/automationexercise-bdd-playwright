@shopping-cart
Feature: Shopping Cart Management
  As a shopper on Automation Exercise
  I want to manage cart line items, custom quantities, subscriptions, recommended items, cart persistence across login, and checkout handoff
  So that my order summary accurately reflects my selections

  @smoke @P0 @TC-CART-01
  Scenario: Verify empty cart state and link back to products
    Given I open the shopping cart page with an empty session
    Then I should see the empty cart banner and be able to navigate to Products

  @smoke @P0 @TC-CART-02 @AE-TC-12
  Scenario: Add multiple products from catalog via cart modal and verify totals
    Given I am on the All Products catalog page
    When I add product 1 and product 2 to the cart from the catalog
    Then the cart table should contain 2 items with accurate prices and totals

  @regression @P1 @TC-CART-03 @AE-TC-13
  Scenario: Add a product with custom quantity from product details page
    When I add product 1 with quantity 4 from the product details page
    Then product 1 in the cart should display quantity "4" and total "Rs. 2000"

  @regression @P1 @TC-CART-04 @AE-TC-17
  Scenario: Remove an item from cart and transition to empty cart state
    Given I have added product 1 to the shopping cart
    When I remove product 1 from the shopping cart
    Then the shopping cart should transition back to the empty state

  @regression @P1 @TC-CART-05
  Scenario: Guest checkout triggers Register / Login modal without bypassing auth
    Given I have added product 1 to the shopping cart
    When I click Proceed To Checkout as a guest shopper
    Then I should see the guest checkout login modal and remain on the cart after dismissing it

  @regression @P1 @TC-CART-06 @AE-TC-11
  Scenario: Subscribe to the footer newsletter from the shopping cart page
    Given I open the shopping cart page with an empty session
    When I subscribe to the footer newsletter with a valid email address
    Then I should see the newsletter subscription success banner

  @regression @e2e @signup @P1 @TC-CART-07 @AE-TC-20
  Scenario: Search products, add to cart, and verify cart persists after login
    Given an ephemeral user account has been registered and logged out
    When I search for "Top", add product 1 to the cart, and log in with the ephemeral user
    Then product 1 should remain persisted in the shopping cart after login

  @regression @P1 @TC-CART-08 @AE-TC-22
  Scenario: Add a product to the shopping cart from Recommended Items
    Given I am on the Automation Exercise home page
    When I add an active recommended item from the home page to the shopping cart
    Then the added recommended item should be visible in the shopping cart
