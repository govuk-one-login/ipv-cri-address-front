@mock-api:address-success @device_intelligence
Feature: Happy Path - Device intelligence cookie is set

  Scenario: User has the di-device-intelligence cookie
    Given Authenticalable Address Amy is using the system
    And they have started the address journey
    # The device intelligence cookie is set in client-side JS. If we check the cookies immediately after loading the first page the cookie won't be present, so we navigate to the next page before testing to ensure that Playwright picks up the cookie
    And they searched for their postcode "E1 8QS"
    Then the di-device-intelligence cookie has been set
