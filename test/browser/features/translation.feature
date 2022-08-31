@mock-api:address-success @success
Feature: Happy Path - changing languages
  Change languages based on cookie

  Background:
    Given Authenticalable Address Amy is using the system

  Scenario: Loading the CRI with Welsh translations enabled
    Given They start with "English"
    And they have started the address journey
    When They set the language to "Welsh"
    Then they should see the search page content in Welsh

  Scenario: Loading the CRI with English translations enabled
    Given They start with "Welsh"
    And they have started the address journey
    When They set the language to "English"
    Then they should see the search page content in English
