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
      And they should see street prefilled with "Whitechapel High Street"
      And they should see town or city prefilled with "London"
      When they add their residency date with a "recent" move year
      And they continue to confirm address
      Then they should see the confirm page

    Scenario: Changing address values and unsuccessfully passing validation when no date is added
      Given they are on the address page
      When they add their residency date with a "" move year
      And they continue to confirm address
      Then they should see an error message on the address page "Enter the year"

    Scenario: Changing address values and unsuccessfully passing validation when no date is invalid
      Given they are on the address page
      When they add their residency date with a "0" move year
      And they continue to confirm address
      Then they should see an error message on the address page "Enter the year using only 4 digits"

    Scenario: Changing address values and unsuccessfully passing validation when the date is in the future
      Given they are on the address page
      When they add their residency date with a "future" move year
      And they continue to confirm address
      Then they should see an error message on the address page "address must be in the past"

    Scenario: Changing address values and unsuccessfully passing validation when the date is in the future
      Given they are on the address page
      When they add their residency date with a "future" move year
      And they continue to confirm address
      Then they should see an error message on the address page "address must be in the past"
