@mock-api:address-success @success
Feature: Move in date validation
  Confirming address details page

  Background:
    Given Authenticalable Address Amy is using the system
    And they have started the address journey
    And they searched for their postcode "E1 8QS"
    Then they should see the results page
    When they have selected Cant find address
    Then they should see the address page

    Scenario: Entering address details fails validation when the year they started living at address is more than one hundred years ago
      Given they are on the address page
      And they add their residency date with a "1900" move year
      And they continue to confirm address
      Then they see an error summary with failed validation message: "Enter a year less than 100 years ago"
