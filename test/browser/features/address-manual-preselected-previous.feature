@mock-api:address-success @success
Feature: Happy Path - confirming preselected address details and date invalidation - previous
  Confirming address details

  Background:
    Given Authenticalable Address Amy is using the system
    And they have started the address journey
    And they searched for their postcode "E1 8QS"
    Then they have selected an address ""
    When they add their residency date with a "recent" move year
    And they continue to confirm address
    And they select the previous UK address within three months radio button
    And they confirm their details
    And they searched for their postcode "E1 8QS"
    Then they should see the results page
    And they have selected an address "1 Whitechapel High Street, London, E1 8QS"
    Then they should see the address page

    Scenario: Changing address values and successfully passing validation when a previous date is added
      Given they are on the address page
      Then they should see the postcode prefilled with "E1 8QS"
      And they should see house number prefilled with "1"
      And they should see street prefilled with "Whitechapel High Street"
      And they should see town or city prefilled with "London"
      When they continue to confirm address
      Then they should see the confirm page
