@mock-api:address-success @success @only
Feature: Happy Path - confirming preselected address details and date invalidation
  Confirming address details

  Background:
    Given Authenticalable Address Amy is using the system
    And they have started the address journey
    And they searched for their postcode "E1 8QS"

    Scenario: Showing validation messages on the showing an address
      Given they should see the results page
      When they choose to go back
      Then they should see the search postcode prefilled with "E1 8QS"
