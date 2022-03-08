@mock-api:address-success @success
Feature: Searching and successfull adding multiple addresses
  Adding multiple addresses journey

  Background:
    Given Authenticalable Address Amy is using the system
    And they have added their current postcode "T35T1N"
    And they have entered the previous address journey

  Scenario: Searching and successfull adding their previous postcode
    Given they have searched for their previous postcode "PR3VC0DE"
    Then they should see the previous results page
    When they have selected their previous address
    Then they should be able confirm both their addresses
