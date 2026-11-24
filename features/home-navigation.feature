@home-navigation
Feature: Home Page & Global Navigation
  As a visitor to Automation Exercise
  I want reliable home page rendering, header routing, newsletter subscription, scroll controls, and reference pages
  So that I can navigate seamlessly across all store workflows

  @smoke @P0 @TC-NAV-01
  Scenario: Verify home page branding, hero carousel, and featured products
    Given I am on the Automation Exercise home page
    Then the home page should display core branding, hero carousel, and 34 featured products

  @smoke @P0 @TC-NAV-02
  Scenario: Navigate across all primary header routes cleanly
    Given I am on the Automation Exercise home page
    When I navigate across all primary header routes from the home page
    Then every primary navigation route should load cleanly

  @regression @P1 @TC-NAV-03 @AE-TC-10
  Scenario: Subscribe to the footer newsletter with a valid email
    Given I am on the Automation Exercise home page
    When I subscribe to the footer newsletter with a valid email address
    Then I should see the newsletter subscription success banner

  @regression @P2 @TC-NAV-04
  Scenario Outline: Reject invalid or empty email in footer newsletter subscription
    Given I am on the Automation Exercise home page
    When I attempt to subscribe to the footer newsletter with an invalid email "<invalidEmail>"
    Then the footer newsletter email field should fail HTML5 validation

    Examples:
      | invalidEmail         |
      | invalid-email-format |
      |                      |

  @regression @P2 @TC-NAV-05 @AE-TC-07
  Scenario: Verify Test Cases and API Testing reference pages metadata and panels
    Given I am on the Automation Exercise home page
    When I visit the Test Cases and API Testing reference pages
    Then both reference pages should expose expected titles, headings, and panels

  @regression @P2 @TC-NAV-06 @AE-TC-25
  Scenario: Verify scroll up using the floating arrow button after scrolling down
    Given I am on the Automation Exercise home page
    When I scroll down to the bottom of the home page
    And I click the floating scroll-up arrow button
    Then the page should scroll back to the top with the hero banner subtitle in viewport

  @regression @P2 @TC-NAV-07 @AE-TC-26
  Scenario: Verify scroll up manually without the arrow button after scrolling down
    Given I am on the Automation Exercise home page
    When I scroll down to the bottom of the home page
    And I scroll manually back to the top of the home page
    Then the page should scroll back to the top with the hero banner subtitle in viewport
