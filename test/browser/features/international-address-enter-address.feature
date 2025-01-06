@mock-api:international-address
Feature: International address - Enter your address

  Background:
    Given International Irene is using the system
    And they have started the address journey
    Then they should see the country selector page

  Scenario: Successfully validate international address with only building apartment number provided
    Given they have selected the country "Kenya"
    When they click the continue button
    Then they should see international address form
    When they add their building address apartment number "A2"
    And they add their international street "Ngong Road"
    And they add their town, suburb or city "Nairobi"
    And they add their Postal code or zipcode "00100"
    And they add their Region "Nairobi County"
    And they add the "recent" year they started living at this address
    And they continue to confirm international address
    Then they should see the non UK confirm page

  Scenario: Successfully validate international address with only building name provided
    Given they have selected the country "Kenya"
    When they click the continue button
    Then they should see international address form
    And they add their building address name "Kilimanjaro Apartments"
    And they add their international street "Ngong Road"
    And they add their town, suburb or city "Nairobi"
    And they add their Postal code or zipcode "00100"
    And they add their Region "Nairobi County"
    And they add the "recent" year they started living at this address
    And they continue to confirm international address
    Then they should see the non UK confirm page

  Scenario: Successfully validate international address with only building number provided
    Given they have selected the country "Kenya"
    When they click the continue button
    Then they should see international address form
    And they add their building address number "45"
    And they add their international street "Ngong Road"
    And they add their town, suburb or city "Nairobi"
    And they add their Postal code or zipcode "00100"
    And they add their Region "Nairobi County"
    And they add the "recent" year they started living at this address
    And they continue to confirm international address
    Then they should see the non UK confirm page

  Scenario: Successfully validate international address with all building details provided
    Given they have selected the country "Kenya"
    When they click the continue button
    Then they should see international address form
    When they add their building address apartment number "A2"
    And they add their building address name "Kilimanjaro Apartments"
    And they add their building address number "45"
    And they add their international street "Ngong Road"
    And they add their town, suburb or city "Nairobi"
    And they add their Postal code or zipcode "00100"
    And they add their Region "Nairobi County"
    And they add the "older" year they started living at this address
    And they continue to confirm international address
    Then they should see the non UK confirm page

  Scenario: Successfully validate international address with all required details except optionals
    Given they have selected the country "Kenya"
    When they click the continue button
    Then they should see international address form
    When they add their building address apartment number "A2"
    And they add their building address name "Kilimanjaro Apartments"
    And they add their building address number "45"
    And they add their town, suburb or city "Nairobi"
    And they add their Postal code or zipcode "00100"
    And they add the "older" year they started living at this address
    And they continue to confirm international address
    Then they should see the non UK confirm page

  Scenario: Enter international address details and fail validation due to no residential year
    Given they have selected the country "Kenya"
    When they click the continue button
    Then they should see international address form
    When they add their building address apartment number "A2"
    And they add their building address name "Kilimanjaro Apartments"
    And they add their building address number "45"
    And they add their international street "Ngong Road"
    And they add their town, suburb or city "Nairobi"
    And they add their Postal code or zipcode "00100"
    And they add their Region "Nairobi County"
    And they continue to confirm international address
    Then they see an error summary with failed validation message: "Enter the year using only 4 digits"

  Scenario: Enter international address details and fail validation due to future residential year
    Given they have selected the country "Kenya"
    When they click the continue button
    Then they should see international address form
    When they add their building address apartment number "A2"
    And they add their building address name "Kilimanjaro Apartments"
    And they add their building address number "45"
    And they add their international street "Ngong Road"
    And they add their town, suburb or city "Nairobi"
    And they add their Postal code or zipcode "00100"
    And they add their Region "Nairobi County"
    And they add the "future" year they started living at this address
    And they continue to confirm international address
    Then they see an error summary with failed validation message: "Enter a year that is not in the future"

  Scenario: Enter international address details and fail validation due to no building address information
    Given they have selected the country "Kenya"
    When they click the continue button
    Then they should see international address form
    And they add their international street "Ngong Road"
    And they add their town, suburb or city "Nairobi"
    And they add their Postal code or zipcode "00100"
    And they add their Region "Nairobi County"
    And they add the "recent" year they started living at this address
    And they continue to confirm international address
    Then they see 3 building address input fields highlighted as invalid with error summary and message: "Enter an apartment number, building number or building name"

  Scenario: Enter international address details fails all validation when no data is entered
    Given they have selected the country "Kenya"
    When they click the continue button
    Then they should see international address form
    And they continue to confirm international address
    Then they see an error summary with failed validation message: "Enter the year using only 4 digits"
    Then they see an error summary with failed validation message: "Enter your town, suburb or city"
    Then they see an error summary with failed validation message: "Enter an apartment number, building number or building name"
    Then they see 3 building address input fields highlighted as invalid with error summary and message: "Enter an apartment number, building number or building name"

  Scenario: Enter international address details fails validation when special characters are included
    Given they have selected the country "Kenya"
    When they click the continue button
    Then they should see international address form
    When they add their building address apartment number "A2-!"
    And they add their building address name "Kilimanjaro Apartments@#"
    And they add their building address number "45*&"
    And they add their international street "Ngong Road$%"
    And they add their town, suburb or city "Nairóbi"
    And they add their Postal code or zipcode "00100!@"
    And they add their Region "Nairóbi County"
    And they add the "older" year they started living at this address
    And they continue to confirm international address
    Then they see an error summary with failed validation message: "Apartment number must only include numbers 0 to 9, letters a to z and .,-\/* or '"
    Then they see an error summary with failed validation message: "Building number must only include numbers 0 to 9, letters a to z and .,-\/* or '"
    Then they see an error summary with failed validation message: "Building name must only include letters a to z, numbers 0 to 9 and .,-\/* or '"
    Then they see an error summary with failed validation message: "Street name must only include letters a to z, numbers 0 to 9 and .,-\/* or '"
    Then they see an error summary with failed validation message: "Postal code or zipcode must only include numbers 0 to 9, letters a to z and .,-\/* or '"
    Then they see an error summary with failed validation message: "Region must only include letters a to z, numbers 0 to 9 and .,-\/* or '"
    Then they see an error summary with failed validation message: "Town, suburb or city must only include letters a to z, numbers 0 to 9 and .,-\/* or '"

  Scenario: Change selected international country, selected same country leads to international page
    Given they have selected the country "Kenya"
    When they click the continue button
    Then they should see international address form
    And they see the change country link "Kenya"
    When they click change country link
    Then they should see the country selector page
    Then they have selected the country "Kenya"
    When they click the continue button
    Then they should see international address form

  Scenario: Change selected international country, selected different international country leads to international address page
    Given they have selected the country "Kenya"
    When they click the continue button
    Then they should see international address form
    And they see the change country link "Kenya"
    When they click change country link
    Then they should see the country selector page
    And they should also see the selected country is empty
    When they have selected the country "France"
    And they click the continue button
    Then they should see international address form
    And they see the change country link "France"

  Scenario: Change selected international country, selected uk country leads to uk address page
    Given they have selected the country "Kenya"
    When they click the continue button
    Then they should see international address form
    And they see the change country link "Kenya"
    When they click change country link
    Then they should see the country selector page
    And they should also see the selected country is empty
    When they have selected the country "Isle of Man"
    And they click the continue button
    Then they should see the UK address form
