@mock-api:address-success @device_intelligence
Feature: Happy Path - Device intelligence cookie is set

  Scenario: User has the di-device-intelligence cookie
    Given Authenticalable Address Amy is using the system
    And they have started the address journey
    And they searched for their postcode "E1 8QS"
    Then the di-device-intelligence cookie has been set
