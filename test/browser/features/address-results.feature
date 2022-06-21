@mock-api:address-success @success
Feature: Happy Path - confirming preselected address details and date invalidation
  Confirming address details

  Background:
    Given Authenticalable Address Amy is using the system
    And they have started the address journey
    And they searched for their postcode "E1 8QS"
    Then they should see the results page

    Scenario: Showing validation messages on the showing an address
      Given they have selected an address "default"
      Then they should see the results page
      And they should see an error message on the results page "Choose an address"
