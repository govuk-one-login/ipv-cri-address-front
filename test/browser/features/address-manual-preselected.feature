@mock-api:address-success @success
Feature: Happy Path - confirming preselected address details and date invalidation
  Confirming address details

  Background:
    Given Authenticalable Address Amy is using the system
    And they have started the address journey
    And they searched for their postcode "E1 8QS"
    Then they should see the results page
    And they have selected an address ""
    Then they should see the address page

    Scenario: Changing address values and successfully passing validation when a previous date is added
      Given they are on the address page
      Then they should see the postcode prefilled with "E1 8QS"
      Then they should see house number prefilled with "10"
      And they should see street prefilled with "WHITECHAPEL HIGH STREET"
      And they should see town or city prefilled with "LONDON"
      When they add their residency date "current"
      And they continue to confirm address
      Then they should see the confirm page

    Scenario: Changing address values and unsuccessfully passing validation when no date is added
      Given they are on the address page
      When they add their residency date ""
      And they continue to confirm address
      Then they should see an error message on the address page "Enter the year using only 4 digits"

    Scenario: Changing address values and unsuccessfully passing validation when the date is in the future
      Given they are on the address page
      When they add their residency date "future"
      And they continue to confirm address
      Then they should see an error message on the address page "address must be in the past"

    Scenario: Changing address values and unsuccessfully passing validation when the date is in the future
      Given they are on the address page
      When they add their residency date "future"
      And they continue to confirm address
      Then they should see an error message on the address page "address must be in the past"
