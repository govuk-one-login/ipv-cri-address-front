@mock-api:international-address
Feature: International address

  Background:
    Given International Irene is using the system
    And they have started the address journey
    Then they should see the country selector page

    Scenario: Selecting a country and continuing
      Given they have selected the country "New Zealand"
      Then they should see international address form

    Scenario: Validation error
      Given they have not selected a country
      Then they should see an error message on the country page "Select the country you live in"