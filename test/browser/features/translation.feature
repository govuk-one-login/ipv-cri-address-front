@mock-api:address-success @success @lang
Feature: Happy Path - changing languages
  Change languages based on cookie or toggle

  Background:
    Given Authenticalable Address Amy is using the system

  Scenario: Loading the CRI with Welsh translations enabled
    Given They start with "English"
    And they have started the address journey
    When They set the language to "Welsh"
    Then they should see the search page content in Welsh
    Then the page's language property should be "Welsh"

  Scenario: Loading the CRI with English translations enabled
    Given They start with "Welsh"
    And they have started the address journey
    When They set the language to "English"
    Then they should see the search page content in English
    Then the page's language property should be "English"

  Scenario: English to Welsh with the language toggle
    Given They start with "English"
    Then they should see the search page content in English
    When they set the language to "Welsh" using the toggle
    Then they should see the search page content in Welsh
    Then the page's language property should be "Welsh"

  Scenario: Welsh to Englishh with the language toggle
    Given They start with "Welsh"
    Then they should see the search page content in Welsh
    When they set the language to "English" using the toggle
    Then they should see the search page content in English
    Then the page's language property should be "English"
