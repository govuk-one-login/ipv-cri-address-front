@mock-api:address-success @success
Feature: Searching and adding an Address
  Viewing the Address lookup successfully

  Background:
    Given Authenticalable Address Amy is using the system
    And they have started the address journey

  @live
  Scenario: Searching and successfully returning a postcode
    Given they searched for their postcode "E1 8QS"
    Then they should see the results page
    And they have selected an address
    Then they should see the address page

  Scenario: Searching and unsuccessfully finding an address
    Given they searched for their postcode "X1 1XX"
    And they see the problem page
    When they choose manual entry
    Then they should see the address page
