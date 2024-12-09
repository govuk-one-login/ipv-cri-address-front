@mock-api:address-success @success
Feature: compliance for address structures presented in https://github.com/alphagov/digital-identity-architecture/blob/main/rfc/0020-address-structure.md#4-examples-of-json

  Background:
    Given Authenticalable Address Amy is using the system
    And they have started the address journey
    And they searched for their postcode "ZZ1 1ZZ"

  Scenario: Show sub building name as flat number
    Then they should see the results page
    And they have selected an address "Flat 1 87 Zzz Way, Whitehouse Milton Keynes, ZZ1 1ZZ"
    Then they should see the address page
    And they should see the postcode prefilled with "ZZ1 1ZZ"
    And they should see flat number prefilled with "Flat 1"
    And they should see house number prefilled with "87"
    And they should see street prefilled with "Zzz Way"
    And they should see town or city prefilled with "Milton Keynes"
    When they add their residency date with a "recent" move year
    And they continue to confirm address
    Then they should see the confirm page
    And they should see the address value "Flat 1"
    And they should see the address value "87 Zzz Way,"
    And they should see the address value "Whitehouse Milton Keynes,"
    And they should see the address value "ZZ1 1ZZ"


  Scenario: Show building name as house name
    Then they should see the results page
    And they have selected an address "Flat 11 Blashford Zzz Road, London, ZZ1 1ZZ"
    Then they should see the address page
    And they should see the postcode prefilled with "ZZ1 1ZZ"
    And they should see flat number prefilled with "Flat 11"
    And they should see house number prefilled with ""
    And they should see house name prefilled with "Blashford"
    And they should see street prefilled with "Zzz Road"
    And they should see town or city prefilled with "London"
    When they add their residency date with a "recent" move year
    And they continue to confirm address
    Then they should see the confirm page
    And they should see the address value "Flat 11 Blashford<br>Zzz Road"
    And they should see the address value "London,"
    And they should see the address value "ZZ1 1ZZ"

  Scenario: Show neither flat number nor house number
    Then they should see the results page
    And they have selected an address "Zzz Marina Zzz Road, Long Zzz Nottingham, ZZ1 1ZZ"
    Then they should see the address page
    And they should see the postcode prefilled with "ZZ1 1ZZ"
    And they should see flat number prefilled with ""
    And they should see house number prefilled with ""
    And they should see house name prefilled with "Zzz Marina"
    And they should see street prefilled with "Zzz Road"
    And they should see town or city prefilled with "Nottingham"
    When they add their residency date with a "recent" move year
    And they continue to confirm address
    Then they should see the confirm page
    And they should see the address value "Zzz Marina"
    And they should see the address value "Zzz Road,"
    And they should see the address value "Long Zzz Nottingham,"
    And they should see the address value "ZZ1 1ZZ"


  Scenario: organisation name and dependent street name of a business is not editable
    Then they should see the results page
    And they have selected an address "Zzz Group Unit 2b Zzz Business Park 16 Zzz Park Zzz Street, Some Zzz Long Eaton Great Missenden, ZZ1 1ZZ"
    Then they should see the address page
    And they should see the postcode prefilled with "ZZ1 1ZZ"
    And they should see flat number prefilled with "Unit 2b"
    And they should see house number prefilled with "16"
    And they should see house name prefilled with "Zzz Business Park"
    And they should see street prefilled with "Zzz Street"
    And they should see town or city prefilled with "Great Missenden"
    When they add their residency date with a "recent" move year
    And they continue to confirm address
    Then they should see the confirm page
    And they should see the address value "Zzz Group Unit 2b Zzz Business Park"
    And they should see the address value "16 Zzz Park Zzz Street,"
    And they should see the address value "Some Zzz Long Eaton Great Missenden,"
    And they should see the address value "ZZ1 1ZZ"

  Scenario: no uprn is ok
    Then they should see the results page
    And they have selected an address "R103 Zzz Park Creek Road, Zzz Island, ZZ1 1ZZ"
    Then they should see the address page
    And they should see the postcode prefilled with "ZZ1 1ZZ"
    And they should see flat number prefilled with ""
    And they should see house number prefilled with ""
    And they should see house name prefilled with "R103"
    And they should see street prefilled with "Creek Road"
    And they should see town or city prefilled with "Zzz Island"
    When they add their residency date with a "recent" move year
    And they continue to confirm address
    Then they should see the confirm page
    And they should see the address value "R103"
    And they should see the address value "Zzz Park Creek Road,"
    And they should see the address value "Zzz Island,"
    And they should see the address value "ZZ1 1ZZ"

  Scenario: dependent address locality is not editable
    Then they should see the results page
    And they have selected an address "13 Zzz Crescent, New Pitsligo Fraserburgh, ZZ1 1ZZ"
    Then they should see the address page
    And they should see the postcode prefilled with "ZZ1 1ZZ"
    And they should see flat number prefilled with ""
    And they should see house number prefilled with "13"
    And they should see house name prefilled with ""
    And they should see street prefilled with "Zzz Crescent"
    And they should see town or city prefilled with "Fraserburgh"
    When they add their residency date with a "recent" move year
    And they continue to confirm address
    Then they should see the confirm page
    And they should see the address value "13"
    And they should see the address value "Zzz Crescent,"
    And they should see the address value "New Pitsligo Fraserburgh,"
    And they should see the address value "ZZ1 1ZZ"

  Scenario: organisation name and dependent street name is not editable
    Then they should see the results page
    And they have selected an address "3 Zzz Walk, Middlesbrough, ZZ1 1ZZ"
    Then they should see the address page
    And they should see the postcode prefilled with "ZZ1 1ZZ"
    And they should see flat number prefilled with ""
    And they should see house number prefilled with "3"
    And they should see house name prefilled with ""
    And they should see street prefilled with "Zzz Walk"
    And they should see town or city prefilled with "Middlesbrough"
    When they add their residency date with a "recent" move year
    And they continue to confirm address
    Then they should see the confirm page
    And they should see the address value "3"
    And they should see the address value "Zzz Walk,"
    And they should see the address value "Middlesbrough,"
    And they should see the address value "ZZ1 1ZZ"
