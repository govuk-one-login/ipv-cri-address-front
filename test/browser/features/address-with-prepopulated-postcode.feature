Feature: Prepopulated Address

  @mock-api:address-prepopulated-postcode
  Scenario: Showing prepopulated postcode
    Given Prepopulated Patrick is using the system
    When they have started the address journey
    Then they should see the search postcode prefilled with "E1 8QS"
    And the driving licence callout should be visible

  @mock-api:address-prepopulated-postcode @only
  Scenario: Showing prepopulated postcode
    Given Prepopulated Patrick is using the system
    And they have started the address journey
    And they searched for their postcode "SW1A 1AA"
    When they choose go back to search
    Then they should see the search postcode prefilled with "SW1A 1AA"
    And the driving licence callout should not be visible

  @mock-api:address-success
  Scenario: Showing non-prepopulated postcode
    Given Unpopulated Una is using the system
    When they have started the address journey
    Then they should not see the search postcode prefilled
    And the driving licence callout should not be visible
