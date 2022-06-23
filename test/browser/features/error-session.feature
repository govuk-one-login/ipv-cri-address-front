@mock-errors
Feature: Error handling

  API Errors at the start of the journey

  @mock-api:session-error
  Scenario: Session error
    Given Error Ethem is using the system
    And they have started the address journey
    And there is an immediate error
    Then they should see the unrecoverable error page
