@only
Feature: E2e test for address journey using the core stub.

  Scenario:
    Given endtoend Eric is using the system
    And they have started the address journey
    And they searched for their postcode "E1 8QS"
    Then they should see the results page
    And they have selected an address ""
    Then they should see the address page
    Given they are on the address page
    When they add their residency date with a "older" move year
    And they continue to confirm address
    And they should see the confirm page
    When they confirm their details
    Then they should be redirected as a success
