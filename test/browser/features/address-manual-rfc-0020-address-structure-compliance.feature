@mock-api:address-success @success
Feature: compliance for address structures presented in https://github.com/alphagov/digital-identity-architecture/blob/main/rfc/0020-address-structure.md#4-examples-of-json

  Background:
    Given Authenticalable Address Amy is using the system
    And they have started the address journey
    And they searched for their postcode "ZZ1 1ZZ"

  Scenario: Show sub building name as flat number
    Then they should see the results page
    And they have selected an address "FLAT 1 87 ZZZ WAY, WHITEHOUSE MILTON KEYNES, ZZ1 1ZZ"
    Then they should see the address page
    And they should see the postcode prefilled with "ZZ1 1ZZ"
    And they should see flat number prefilled with "FLAT 1"
    And they should see house number prefilled with "87"
    And they should see street prefilled with "ZZZ WAY"
    And they should see town or city prefilled with "MILTON KEYNES"
    When they add their residency date "current"
    And they continue to confirm address
    Then they should see the confirm page
    And they should see the address value "FLAT 1 87ZZZ WAY,"
    And they should see the address value "WHITEHOUSE MILTON KEYNES,"
    And they should see the address value "ZZ1 1ZZ"


  Scenario: Show building name as house name
    Then they should see the results page
    And they have selected an address "FLAT 11 BLASHFORD ZZZ ROAD, LONDON, ZZ1 1ZZ"
    Then they should see the address page
    And they should see the postcode prefilled with "ZZ1 1ZZ"
    And they should see flat number prefilled with "FLAT 11"
    And they should see house number prefilled with ""
    And they should see house name prefilled with "BLASHFORD"
    And they should see street prefilled with "ZZZ ROAD"
    And they should see town or city prefilled with "LONDON"
    When they add their residency date "current"
    And they continue to confirm address
    Then they should see the confirm page
    And they should see the address value "FLAT 11 BLASHFORDZZZ ROAD,"
    And they should see the address value "LONDON,"
    And they should see the address value "ZZ1 1ZZ"

  Scenario: Show neither flat number nor house number
    Then they should see the results page
    And they have selected an address "ZZZ MARINA ZZZ ROAD, LONG ZZZ NOTTINGHAM, ZZ1 1ZZ"
    Then they should see the address page
    And they should see the postcode prefilled with "ZZ1 1ZZ"
    And they should see flat number prefilled with ""
    And they should see house number prefilled with ""
    And they should see house name prefilled with "ZZZ MARINA"
    And they should see street prefilled with "ZZZ ROAD"
    And they should see town or city prefilled with "NOTTINGHAM"
    When they add their residency date "current"
    And they continue to confirm address
    Then they should see the confirm page
    And they should see the address value "ZZZ MARINA"
    And they should see the address value "ZZZ ROAD,"
    And they should see the address value "LONG ZZZ NOTTINGHAM,"
    And they should see the address value "ZZ1 1ZZ"


  Scenario: organisation name and dependent street name of a business is not editable
    Then they should see the results page
    And they have selected an address "ZZZ GROUP UNIT 2B ZZZ BUSINESS PARK 16 ZZZ PARK ZZZ STREET, SOME ZZZ LONG EATON GREAT MISSENDEN, ZZ1 1ZZ"
    Then they should see the address page
    And they should see the postcode prefilled with "ZZ1 1ZZ"
    And they should see flat number prefilled with "UNIT 2B"
    And they should see house number prefilled with "16"
    And they should see house name prefilled with "ZZZ BUSINESS PARK"
    And they should see street prefilled with "ZZZ STREET"
    And they should see town or city prefilled with "GREAT MISSENDEN"
    When they add their residency date "current"
    And they continue to confirm address
    Then they should see the confirm page
    And they should see the address value "ZZZ GROUP UNIT 2B ZZZ BUSINESS PARK 16"
    And they should see the address value "ZZZ PARK ZZZ STREET,"
    And they should see the address value "SOME ZZZ LONG EATON GREAT MISSENDEN,"
    And they should see the address value "ZZ1 1ZZ"

  Scenario: no uprn is ok
    Then they should see the results page
    And they have selected an address "R103 ZZZ PARK CREEK ROAD, ZZZ ISLAND, ZZ1 1ZZ"
    Then they should see the address page
    And they should see the postcode prefilled with "ZZ1 1ZZ"
    And they should see flat number prefilled with ""
    And they should see house number prefilled with ""
    And they should see house name prefilled with "R103"
    And they should see street prefilled with "CREEK ROAD"
    And they should see town or city prefilled with "ZZZ ISLAND"
    When they add their residency date "current"
    And they continue to confirm address
    Then they should see the confirm page
    And they should see the address value "R103"
    And they should see the address value "ZZZ PARK CREEK ROAD,"
    And they should see the address value "ZZZ ISLAND,"
    And they should see the address value "ZZ1 1ZZ"

  Scenario: dependent address locality is not editable
    Then they should see the results page
    And they have selected an address "13 ZZZ CRESCENT, NEW PITSLIGO FRASERBURGH, ZZ1 1ZZ"
    Then they should see the address page
    And they should see the postcode prefilled with "ZZ1 1ZZ"
    And they should see flat number prefilled with ""
    And they should see house number prefilled with "13"
    And they should see house name prefilled with ""
    And they should see street prefilled with "ZZZ CRESCENT"
    And they should see town or city prefilled with "FRASERBURGH"
    When they add their residency date "current"
    And they continue to confirm address
    Then they should see the confirm page
    And they should see the address value "13"
    And they should see the address value "ZZZ CRESCENT,"
    And they should see the address value "NEW PITSLIGO FRASERBURGH,"
    And they should see the address value "ZZ1 1ZZ"

  Scenario: organisation name and dependent street name is not editable
    Then they should see the results page
    And they have selected an address "3 ZZZ WALK, MIDDLESBROUGH, ZZ1 1ZZ"
    Then they should see the address page
    And they should see the postcode prefilled with "ZZ1 1ZZ"
    And they should see flat number prefilled with ""
    And they should see house number prefilled with "3"
    And they should see house name prefilled with ""
    And they should see street prefilled with "ZZZ WALK"
    And they should see town or city prefilled with "MIDDLESBROUGH"
    When they add their residency date "current"
    And they continue to confirm address
    Then they should see the confirm page
    And they should see the address value "3"
    And they should see the address value "ZZZ WALK,"
    And they should see the address value "MIDDLESBROUGH,"
    And they should see the address value "ZZ1 1ZZ"

