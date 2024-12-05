@mock-api:international-address
Feature: International address - Confirm Screen

  Background:
    Given International Irene is using the system
    And they have started the address journey
    And they have selected the country "Kenya"
    And they click the continue button
    And they add their building address apartment number "A2"
    And they add their town, suburb or city "Nairobi"

  Scenario: Successfully display the non UK confirm page with a minimal address
    Given they are on the international address form
    And they add the "older" year they started living at this address
    When they continue to confirm international address
    Then they should see the non UK confirm page
    And they should see the non UK address value "A2<br>Nairobi<br>Kenya"
    And they should see the non UK year value "older"
    And they should not see the previous address radio button
    And they should not see the previous address row

  Scenario: Successfully confirm a non UK confirm page with a minimal address
    Given they are on the international address form
    And they add the "older" year they started living at this address
    And they continue to confirm international address
    When they confirm their non UK details
    Then they should be redirected as a success

  Scenario: Successfully display the non UK confirm page with a full address
    Given they are on the international address form
    And they add their building address name "Kilimanjaro Apartments"
    And they add their building address number "45"
    And they add their international street "Ngong Road"
    And they add their Postal code or zipcode "00100"
    And they add their Region "Nairobi County"
    And they add the "older" year they started living at this address
    When they continue to confirm international address
    Then they should see the non UK confirm page
    And they should see the non UK address value "A2<br>45<br>Kilimanjaro Apartments<br>Ngong Road<br>Nairobi<br>00100<br>Nairobi County<br>Kenya"
    And they should see the non UK year value "older"
    And they should not see the previous address radio button
    And they should not see the previous address row

  Scenario: Successfully confirm a non UK confirm page with a full address
    Given they are on the international address form
    And they add their building address name "Kilimanjaro Apartments"
    And they add their building address number "45"
    And they add their international street "Ngong Road"
    And they add their Postal code or zipcode "00100"
    And they add their Region "Nairobi County"
    And they add the "older" year they started living at this address
    And they continue to confirm international address
    When they confirm their non UK details
    Then they should be redirected as a success

Scenario: Successfully display the non UK confirm page without Previous Address modal with recent year
    Given they are on the international address form
    And they add the "recent" year they started living at this address
    When they continue to confirm international address
    Then they should see the non UK confirm page
    And they should see the non UK address value "A2<br>Nairobi<br>Kenya"
    And they should see the non UK year value "recent"
    And they should not see the previous address radio button
    And they should not see the previous address row

Scenario: Successfully direct back to enter address when change address is clicked
    Given they are on the international address form
    And they add the "older" year they started living at this address
    And they continue to confirm international address
    When they click change non UK address
    Then they should see international address form
    And they see the change country link "Kenya"
    And they see the Apartment Number Input with value "A2"
    And they see the Town Input with value "Nairobi"
    And they see the Region with value ""
    And they see the Year From with value "older"

Scenario: Successfully direct back to enter address when change year is clicked
    Given they are on the international address form
    And they add the "older" year they started living at this address
    And they continue to confirm international address
    When they click change non UK year from
    Then they should see international address form
    And they see the change country link "Kenya"
    And they see the Apartment Number Input with value "A2"
    And they see the Town Input with value "Nairobi"
    And they see the Region with value ""
    And they see the Year From with value "older"

Scenario: Successfully direct back to enter address when back is clicked
    Given they are on the international address form
    And they add the "older" year they started living at this address
    And they continue to confirm international address
    When they click back from non UK confirm page
    Then they should see international address form
    And they see the change country link "Kenya"
    And they see the Apartment Number Input with value "A2"
    And they see the Town Input with value "Nairobi"
    And they see the Region with value ""
    And they see the Year From with value "older"

Scenario: Successfully direct back to enter address when user navigates back
    Given they are on the international address form
    And they add the "older" year they started living at this address
    And they continue to confirm international address
    When they navigate back from non UK confirm
    Then they should see international address form
    And they see the change country link "Kenya"
    And they see the Apartment Number Input with value "A2"
    And they see the Town Input with value "Nairobi"
    And they see the Region with value ""
    And they see the Year From with value "older"
