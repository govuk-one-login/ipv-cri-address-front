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

    Scenario: Should not show the validation message when pressing back and selecting the same address
      Given they have selected an address ""
      And they should see the address page
      And they click back from the address page
      And they should see the results page
      When they have selected an address ""
      Then they should see the address page
