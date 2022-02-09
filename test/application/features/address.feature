@mock-api:address-success @success
Feature: Happy path
  Viewing the Address lookup successfully

  Background:
    Given Authenticalable Address Amy is using the system
    And they have started the address journey

  Scenario: Selecting an address
    Given they searched for their postcode "T35T1N"
    Then they should see the results page
    And they have selected an address
    Then they should be able to confirm the address

