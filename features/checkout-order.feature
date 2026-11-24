@checkout-order
Feature: Checkout & Order Confirmation
  As an authenticated shopper on Automation Exercise
  I want to verify my delivery and billing addresses, review my order, confirm payment safely across registration/login journeys, and download my invoice
  So that orders are accurate and validated before confirmation

  @smoke @e2e @signup @P0 @TC-CHK-01 @AE-TC-23
  Scenario: Verify checkout delivery and billing addresses match registration details
    Given I am an authenticated ephemeral user with product 1 in my cart
    When I proceed from the cart to the checkout page
    Then the checkout delivery and billing addresses should match my registration profile with total "Rs. 500"

  @regression @e2e @signup @P1 @TC-CHK-02
  Scenario: Add an order comment and transition from Checkout to Payment
    Given I am an authenticated ephemeral user with product 1 in my cart
    When I proceed from the cart to the checkout page
    And I enter an order comment "QA automated order verification note." and click Place Order
    Then I should reach the Payment page with all required card fields visible

  @regression @e2e @signup @P1 @TC-CHK-03 @AE-TC-15
  Scenario: Place Order after registering before checkout and verify Order Placed confirmation
    Given I am an authenticated ephemeral user with product 1 in my cart
    When I proceed from the cart to the checkout page
    And I enter an order comment "QA sandbox order confirmation test." and click Place Order
    And I submit synthetic sandbox payment card details
    Then I should see the Order Placed confirmation message

  @regression @signup @P2 @TC-CHK-04
  Scenario: Reject empty card fields on Payment page via HTML5 validation
    Given I am an authenticated ephemeral user with product 1 in my cart
    When I proceed from the cart to the checkout page
    And I enter an order comment "QA payment validation check." and click Place Order
    And I attempt to submit the Payment form with empty card fields
    Then the Payment form should fail HTML5 validation and remain on the payment route

  @regression @signup @P2 @TC-CHK-05
  Scenario: Verify Checkout and Payment page titles, headings, and accessible controls
    Given I am an authenticated ephemeral user with product 1 in my cart
    When I proceed from the cart to the checkout page
    Then both Checkout and Payment pages should expose valid titles, headings, and accessible CTA controls

  @regression @e2e @signup @P1 @TC-CHK-06 @AE-TC-14
  Scenario: Place Order by registering while checking out as a guest
    Given I have added product 1 to the shopping cart
    When I click Proceed To Checkout as a guest shopper
    And I register a new ephemeral user via the guest checkout modal and return to checkout
    Then the checkout delivery and billing addresses should match my registration profile with total "Rs. 500"
    When I enter an order comment "QA register-while-checkout order test." and click Place Order
    And I submit synthetic sandbox payment card details
    Then I should see the Order Placed confirmation message
    When I delete the currently logged-in account
    Then I should see the Account Deleted confirmation and return home

  @regression @e2e @signup @P1 @TC-CHK-07 @AE-TC-16
  Scenario: Place Order by logging in before checkout with an existing account
    Given an ephemeral user account has been registered and logged out
    When I log in with the existing ephemeral user and add product 1 to the cart
    And I proceed from the cart to the checkout page
    Then the checkout delivery and billing addresses should match my registration profile with total "Rs. 500"
    When I enter an order comment "QA login-before-checkout order test." and click Place Order
    And I submit synthetic sandbox payment card details
    Then I should see the Order Placed confirmation message
    When I delete the currently logged-in account
    Then I should see the Account Deleted confirmation and return home

  @regression @e2e @signup @P1 @TC-CHK-08 @AE-TC-24
  Scenario: Download purchase invoice after completing a sandbox order
    Given I am an authenticated ephemeral user with product 1 in my cart
    When I proceed from the cart to the checkout page
    And I enter an order comment "QA download invoice verification." and click Place Order
    And I submit synthetic sandbox payment card details
    Then I should see the Order Placed confirmation message
    When I download the purchase invoice from the order confirmation page
    Then the downloaded invoice file should be non-empty and I can continue back home
