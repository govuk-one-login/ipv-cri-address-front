@mock-api:address-prepopulated-postcode
Feature: Prepopulated Address

  @only
  Scenario: Showing prepopulated postcode
    Given Prepopulated Patrick is using the system
    When they have started the address journey
    Then they should see the postcode prefilled with "E1 8QS"
#    And they searched for their postcode "E1 8QS"
#    Then they should see the results page

#  @mock-api:address
#  Scenario: Showing non-prepopulated postcode
#    Given Unpopulated Una is using the system
#    When they have started the address journey
#    Then they should not see the postcode prefilled

#  Scenario: Prepopulated error
#    Given Prepopulated Error Penny is using the system
#    When they have started the address journey
#    Then they should not see the postcode prefilled
