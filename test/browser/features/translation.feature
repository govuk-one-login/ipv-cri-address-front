@mock-api:address-success @success
Feature: Happy Path - changing languages
  Change languages based on cookie

  Background:
    Given Authenticalable Address Amy is using the system
    And they have Welsh language set

  Scenario: Loading the CRI with Welsh translations enabled
    Given they have started the address journey
    Then they should see the search page content in Welsh
