@mock-api:address-success @success
Feature: Confirming flat number is displayed correctly after manual entry

    Feature Description: User is asked to enter their address manually if the system does not recognise their postcode. User enters their address including Flat Number manually.

Background:
    Given Authenticalable Address Amy is using the system
    And they have started the address journey
    And they searched for their postcode "E1 8QS"
    Then they should see the results page
    When they have selected Cant find address

    Scenario: Testing flat number on edit
      Given they are on the address page
      When they add their flat number "17"
      And they add their house number "115"
      And they add their street "Downing Street"
      And they add their city "London"
      And they add their residency date "2014"
      And they continue to confirm address
      Then they should see the address value "17<br>115 Downing Street,<br>"

    Scenario: Testing flat number on edit
      Given they are on the address page
      When they add their flat number "17"
      And they add their house name "house"
      And they add their street "Downing Street"
      And they add their city "London"
      And they add their residency date "2014"
      And they continue to confirm address
      Then they should see the address value "17 house<br>Downing Street,<br>"

    Scenario: Testing flat number on edit
      Given they are on the address page
      When they add their flat number "17"
      And they add their house name "house"
      And they add their house number "115"
      And they add their street "Downing Street"
      And they add their city "London"
      And they add their residency date "2014"
      And they continue to confirm address
      Then they should see the address value "17 house<br>115 Downing Street,<br>"
