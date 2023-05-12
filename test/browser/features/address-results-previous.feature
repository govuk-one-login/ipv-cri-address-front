@mock-api:address-success @success
Feature: Happy Path - confirming preselected address details and date invalidation
  Confirming address details

  Background:
    Given Authenticalable Address Amy is using the system
    And they have started the address journey
    And they searched for their postcode "E1 8QS"
    Then they have selected an address ""
    When they add their residency date with a "recent" move year
    And they continue to confirm address
    And they select the less than three months radio button
    And they confirm their details
    And they searched for their postcode "E1 8QS"
    Then they should see the results page

    Scenario: Showing validation messages on the showing an address
      Given they have selected an address "default"
      Then they should see the results page
      And they should see an error message on the results page "Choose an address"

    Scenario: Showing validation message when same address is chosen
      Given they have selected an address ""
      Then they should see the results page
      And they should see an error message on the results page "previous address cannot be the same"
