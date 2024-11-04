@mock-api:address-success @success
Feature: Happy Path - previous
  Viewing the Address lookup successfully

  Background:
      Given Authenticalable Address Amy is using the system
      And they have started the address journey
      And they searched for their postcode "E1 8QS"
      Then they have selected an address "10 WHITECHAPEL HIGH STREET, LONDON, E1 8QS"
      When they add their residency date with a "recent" move year
      And they continue to confirm address
      And they select the previous UK address within three months radio button
      And they confirm their details

    Scenario: Previous address - Searching and successfully returning a postcode and saving a single address
      Given they searched for their postcode "E1 8QS"
      Then they should see the results page
      And they have selected an address "1 WHITECHAPEL HIGH STREET, LONDON, E1 8QS"
      Then they should see the address page

    Scenario: Previous address - Searching and unsuccessfully finding an address and continuing
      Given they searched for their postcode "X1 1XX"
      And they see the problem page
      When they choose manual entry
      Then they should see the address page

    Scenario: Previous address - Searching and unsuccessfully finding an address and going back to search
      Given they searched for their postcode "X1 1XX"
      And they see the problem page
      When they choose go back to search
      Then they should see the search page

    Scenario: Previous address - Searching and successfully finding an address and then selecting cant find my address
      Given they searched for their postcode "E1 8QS"
      Then they should see the results page
      And they should see the result postcode "E1 8QS"
      When they have selected Cant find address
      Then they should see the address page

    Scenario: Previous address - Searching and successfully finding an address and then selecting change my postcode
      Given they searched for their postcode "E1 8QS"
      Then they should see the results page
      And they should see the result postcode "E1 8QS"
      When they select change postcode
      Then they should see the search page

    Scenario: Previous address - Searching and unsuccessfully passing validation when postcode is too short
      Given they searched for their postcode "E1"
      Then they should see the search page
      And they should see an error message on the search page "between 5 and 7"

    Scenario: Previous address - Searching and unsuccessfully passing validation when postcode is too long
      Given they searched for their postcode "E1 8QSJAAA"
      Then they should see the search page
      And they should see an error message on the search page "between 5 and 7"

    Scenario: Previous address - Searching and unsuccessfully passing validation when postcode is not entered
      Given they searched for their postcode ""
      Then they should see the search page
      And they should see an error message on the search page "Enter your postcode"

    Scenario: Previous address - Searching and unsuccessfully passing validation when postcode is a non uk postcode
      Given they searched for their postcode "M1E1P5"
      Then they should see the search page
      And they should see an error message on the search page "Enter a UK postcode"

    Scenario: Previous address - Searching and unsuccessfully passing validation when postcode contains special characters
      Given they searched for their postcode "WD6 @JX"
      Then they should see the search page
      And they should see an error message on the search page "only include numbers and letters"
