@auth-account
Feature: Authentication & Account Lifecycle
  As a customer on Automation Exercise
  I want to register, authenticate, log out, receive clear error validation, and delete my account
  So that my account lifecycle is secure and self-cleaning

  @smoke @e2e @signup @P0 @TC-AUTH-01 @AE-TC-01
  Scenario: Register a new ephemeral account and permanently delete it
    When I register a new ephemeral user account
    Then I should be logged in as the newly registered user
    When I delete the currently logged-in account
    Then I should see the Account Deleted confirmation and return home

  @regression @P1 @TC-AUTH-02 @AE-TC-03
  Scenario: Reject invalid login credentials with server error message
    Given I am on the Signup and Login page
    When I submit invalid login credentials "invalid.qa.9999@example.com" and "WrongPassword!123"
    Then I should see the incorrect login credentials error message

  @regression @signup @P1 @TC-AUTH-03 @AE-TC-05
  Scenario: Block registration with an already existing email address
    Given an ephemeral user account has been registered and logged out
    When I attempt to sign up again using the existing ephemeral email
    Then I should see the duplicate email registration error message

  @smoke @e2e @signup @P0 @TC-AUTH-04 @AE-TC-02 @AE-TC-04
  Scenario: Log out and re-authenticate with valid ephemeral credentials
    When I register a new ephemeral user account
    And I log out and log back in with the ephemeral user credentials
    Then I should be logged in as the newly registered user

  @regression @P2 @TC-AUTH-05
  Scenario: Enforce native HTML5 validation on malformed or empty auth fields
    Given I am on the Signup and Login page
    When I submit malformed or empty credentials on Login and Signup forms
    Then both Login and Signup forms should fail HTML5 native validation
