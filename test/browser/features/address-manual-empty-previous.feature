@mock-api:address-success @success
Feature: Happy Path - confirming manual address details - previous
  Confirming address details

  Background:
    Given Authenticalable Address Amy is using the system
    And they have started the address journey
    And they searched for their postcode "E1 8QS"
    Then they have selected an address ""
    When they add their residency date "2023"
    And they continue to confirm address
    And they select the less than three months radio button
    And they confirm their details
    And they searched for their postcode "E1 8QS"
    Then they should see the results page
    When they have selected Cant find address
    Then they should see the address page

    Scenario: Changing address values and successfully passing validation
      Given they are on the address page
      When they add their flat number "1"
      And they add their house name "stratford house"
      And they add their street "Park street"
      And they add their city "London"
      And they continue to confirm address
      Then they should see the confirm page


    Scenario: Changing address values and unsuccessfully passing validation when the town or city is missing
      Given they are on the address page
      When they add their flat number "1"
      And they add their house name "stratford house"
      And they add their street "Park street"
      And they add their city ""
      And they continue to confirm address
      Then they should see an error message on the address page "Enter your town or city"

    Scenario: Changing address values and unsuccessfully passing validation when the House name or number is missing
      Given they are on the address page
      When they add their street "Park street"
      And they add their house name ""
      And they add their house number ""
      And they add their city "London"
      And they continue to confirm address
      Then they should see an error message on the address page "Enter a house name or house number"
