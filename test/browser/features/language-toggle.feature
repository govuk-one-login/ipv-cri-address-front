@mock-errors @lang
Feature: Language toggle

  Using language toggle on error page

  Background:
    Given Error Ethem is using the system
    And they have started the address journey
    And there is an immediate error
    Then they should see the unrecoverable error page

Scenario: English to Welsh with the language toggle
    Given They start with "English"
    And they see the page in "English"
    When they set the language to "Welsh" using the toggle
    Then they should see the page in "Welsh"

  Scenario: Welsh to Englishh with the language toggle
    Given They start with "Welsh"
    And they see the page in "Welsh"
    When they set the language to "English" using the toggle
    Then they should see the page in "English"
