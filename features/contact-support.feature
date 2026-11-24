@contact-support
Feature: Contact Us & Support Inquiry
  As a visitor needing customer support
  I want to submit an inquiry with an optional file attachment and receive confirmation
  So that my message reaches the support team reliably

  Background:
    Given I am on the Contact Us page

  @smoke @P0 @TC-CNT-01
  Scenario: Verify Contact Us page title, headings, and form controls
    Then the Contact Us page should display its title, headings, and form controls

  @regression @P1 @TC-CNT-02 @AE-TC-06
  Scenario: Submit Contact Us form with fixture file upload and dialog confirmation
    When I submit the Contact Us form with valid details and an uploaded fixture file
    Then I should see the Contact Us submission success banner

  @regression @P1 @TC-CNT-03 @AE-TC-06
  Scenario: Return to home page cleanly after Contact Us submission
    When I submit the Contact Us form with valid details and an uploaded fixture file
    Then I should see the Contact Us submission success banner
    When I click the return Home button on the Contact Us confirmation state
    Then I should be returned to the Automation Exercise home page

  @regression @P2 @TC-CNT-04
  Scenario: Block Contact Us submission when required email field is empty
    When I attempt to submit the Contact Us form without an email address
    Then the Contact Us email field should fail HTML5 validation
