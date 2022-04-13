@mock-api:address-success @success
Feature: Searching and adding an Address
  Viewing the Address lookup successfully

  Background:
    Given Authenticalable Address Amy is using the system
    And they have started the address journey

  @live
  Scenario: Searching and successfully returning a postcode
    Given they searched for their postcode "T35T1N"
    Then they should see the results page
    And they have selected an address
    Then they should be able to confirm the address

  Scenario: Searching and unsuccessfully finding an address
    Given they searched for their postcode "XXX_XX"
    Then they should see the address page
    When they have added their details manually
    Then they should be able to confirm the address
