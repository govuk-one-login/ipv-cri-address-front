@mock-api:address-success @success
Feature: Happy Path - confirming manual address details
  Confirming address details

  Background:
    Given Authenticalable Address Amy is using the system
    And they have started the address journey
    And they searched for their postcode "E1 8QS"
    Then they should see the results page
    When they have selected Cant find address
    Then they should see the address page

    Scenario: Entering address details fails validation when fields are too long
      Given they are on the address page
      When they add their flat number "1234567890123456789012345678901"
      And they add their house number "1234567890123456789012345678901"
      And they add their house name "123456789012345678901234567890123456789012345678901"
      And they add their street "1234567890123456789012345678901234567890123456789012345678901"
      And they add their city "1234567890123456789012345678901234567890123456789012345678901"
      And they add their residency date with a "older" move year
      And they continue to confirm address
      Then they see an error summary with failed validation message: "Flat number must be 30 characters or less"
      Then they see an error summary with failed validation message: "House number must be 30 characters or less"
      Then they see an error summary with failed validation message: "House name must be 50 characters or less"
      Then they see an error summary with failed validation message: "Street name must be 60 characters or less"
      Then they see an error summary with failed validation message: "Town or city must be 60 characters or less"
