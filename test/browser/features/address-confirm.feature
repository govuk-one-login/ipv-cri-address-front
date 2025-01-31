@mock-api:address-success @success
Feature: Happy Path - confirming address details
  Confirming address details

  Background:
    Given Authenticalable Address Amy is using the system
    And they have started the address journey
    And they searched for their postcode "E1 8QS"
    Then they should see the results page
    And they have selected an address ""
    Then they should see the address page

    Scenario: Adding an year date that should show the previous address modal
      Given they are on the address page
      When they add their residency date with a "recent" move year
      And they continue to confirm address
      Then they should see the confirm page

    Scenario: Adding an year date that should not show the previous address modal
      Given they are on the address page
      When they add their residency date with a "older" move year
      And they continue to confirm address
      Then they should see the confirm page
      And they should not see the previous address modal

    Scenario: Not selecting a radio button should show a validation message
      Given they are on the address page
      When they add their residency date with a "recent" move year
      And they continue to confirm address
      Then they should see the confirm page
      And they should see the previous address modal
      When they confirm their details
      Then they should see an error message "Select yes if you’ve lived at another UK address in the past three months."

    Scenario: Selecting less than 3 months residence should move the user to the previous address journey
      Given they are on the address page
      When they add their residency date with a "recent" move year
      And they continue to confirm address
      Then they should see the confirm page
      And they should see the previous address modal
      When they select the previous UK address within three months radio button
      And they confirm their details
      Then they should see the previous address search page

    Scenario: Changing an address
      Given they are on the address page
      When they add their residency date with a "recent" move year
      And they continue to confirm address
      Then they should see the confirm page
      When they click change current address
      Then they should see the address page
      When they add their street "Park street"
      And they continue to confirm address
      Then they should see the confirm page
      And they should see the address value "Park street"

    Scenario: Changing year from value
      Given they are on the address page
      When they add their residency date with a "recent" move year
      And they continue to confirm address
      Then they should see the confirm page
      When they click change year from
      Then they should see the address page
      When they add their residency date with a "older" move year
      And they continue to confirm address
      Then they should see the confirm page
      And they should see the year value "older"
