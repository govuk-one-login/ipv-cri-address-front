module.exports = {
  apiResponse: {
    data: [
      {
        buildingNumber: "1",
        streetName: "SOME ROAD",
        addressLocality: "SOMEWHERE",
        postalCode: "SOMEPOST",
      },
      {
        buildingName: "NAMED BUILDING",
        streetName: "SOME ROAD",
        addressLocality: "SOMEWHERE",
        postalCode: "SOMEPOST",
      },
      {
        organisationName: "NAMED ORG",
        departmentName: "MY DEPARTMENT",
        buildingName: "NAMED BUILDING",
        streetName: "SOME ROAD",
        addressLocality: "SOMEWHERE",
        postalCode: "SOMEPOST",
      },
      {
        subBuildingName: "SUBBUILDING NAME",
        buildingName: "NAMED BUILDING",
        dependentStreetName: "SOME DEPENDENT ROAD",
        streetName: "SOME ROAD",
        doubleDependentAddressLocality: "SOMEWHERE DOUBLE DEP",
        dependentAddressLocality: "SOMEWHERE DEP",
        addressLocality: "SOMEWHERE",
        postalCode: "SOMEPOST",
      },
    ],
  },
  formattedAddressed: [
    {
      buildingNumber: "1",
      streetName: "SOME ROAD",
      addressLocality: "SOMEWHERE",
      postalCode: "SOMEPOST",
      text: "1 SOME ROAD, SOMEWHERE, SOMEPOST",
      value: "1 SOME ROAD, SOMEWHERE, SOMEPOST",
    },
    {
      buildingName: "NAMED BUILDING",
      streetName: "SOME ROAD",
      addressLocality: "SOMEWHERE",
      postalCode: "SOMEPOST",
      text: "NAMED BUILDING SOME ROAD, SOMEWHERE, SOMEPOST",
      value: "NAMED BUILDING SOME ROAD, SOMEWHERE, SOMEPOST",
    },
    {
      organisationName: "NAMED ORG",
      departmentName: "MY DEPARTMENT",
      buildingName: "NAMED BUILDING",
      streetName: "SOME ROAD",
      addressLocality: "SOMEWHERE",
      postalCode: "SOMEPOST",
      text: "NAMED ORG MY DEPARTMENT NAMED BUILDING SOME ROAD, SOMEWHERE, SOMEPOST",
      value:
        "NAMED ORG MY DEPARTMENT NAMED BUILDING SOME ROAD, SOMEWHERE, SOMEPOST",
    },
    {
      buildingName: "NAMED BUILDING",
      subBuildingName: "SUBBUILDING NAME",
      dependentStreetName: "SOME DEPENDENT ROAD",
      streetName: "SOME ROAD",
      doubleDependentAddressLocality: "SOMEWHERE DOUBLE DEP",
      dependentAddressLocality: "SOMEWHERE DEP",
      addressLocality: "SOMEWHERE",
      postalCode: "SOMEPOST",
      text: "NAMED BUILDING SUBBUILDING NAME SOME DEPENDENT ROAD SOME ROAD, SOMEWHERE DOUBLE DEP SOMEWHERE DEP SOMEWHERE, SOMEPOST",
      value:
        "NAMED BUILDING SUBBUILDING NAME SOME DEPENDENT ROAD SOME ROAD, SOMEWHERE DOUBLE DEP SOMEWHERE DEP SOMEWHERE, SOMEPOST",
    },
  ],
  addressApiResponse: {
    data: {
      code: "mySuperSecretCode",
      state: "myAwesomeState",
      redirect_uri: "http://localhost:8085/callback",
    },
  },
};
