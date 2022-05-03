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
    ],
  },
  formattedAddressed: [
    {
      buildingNumber: "1",
      streetName: "SOME ROAD",
      postTown: "SOMEWHERE",
      postcode: "SOMEPOST",
      text: "1, SOMEROAD, SOMEWHERE, SOMEPOST",
      value: "1, SOMEROAD, SOMEWHERE, SOMEPOST",
    },
    {
      buildingNumber: "NAMED BUILDING",
      streetName: "SOME ROAD",
      postTown: "SOMEWHERE",
      postcode: "SOMEPOST",
      text: "NAMED BUILDING, SOMEROAD, SOMEWHERE, SOMEPOST",
      value: "NAMED BUILDING, SOMEROAD, SOMEWHERE, SOMEPOST",
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
