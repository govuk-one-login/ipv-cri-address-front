@mock-api:address-success @mock-errors
Feature: Error handling

  API Errors in middle of journey

  Scenario: Error - Page not found
    Given Error Ethem is using the system
    And they have started the address journey
    When they go to an unknown page
    Then they should see the Page not found error page
