Feature: Confirming flat number is displayed correctly after manual entry

    Feature Description: User is asked to enter their address manually if the system does not recognise their postcode. User enters their address including Flat Number manually.

    Scenario: Testing flat number on edit
        Given user is on Address CRI Build Environment
        When user enters their postcode and click Find address
        And user clicks I cannot find my address in the list
        When user enters their flat number manually
        Then the flat number is displayed correctly