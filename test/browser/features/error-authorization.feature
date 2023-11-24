@mock-errors @mock-api:authorization-error
Feature: Error handling

  API Errors in middle of journey

  Background:
    Given Error Ethem is using the system
    And they have started the address journey
    And they searched for their postcode "E1 8QS"
    Then they should see the results page
    And they have selected an address ""
    Then they should see the address page
    Given they are on the address page
    When they add their residency date with a "older" move year
    And they continue to confirm address

  @mock-api:authorization-error @wip
  Scenario: Error redirection
    Given they should see the confirm page
    When they confirm their details
    Then they should be redirected as an error with a description "gateway"


