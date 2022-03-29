module.exports = {
  apiResponse: {
    data: [
      {
        buildingNumber: "1",
        thoroughfareName: "SOME ROAD",
        postTown: "SOMEWHERE",
        postcode: "SOMEPOST",
      },
      {
        buildingNumber: "NAMED BUILDING",
        thoroughfareName: "SOME ROAD",
        postTown: "SOMEWHERE",
        postcode: "SOMEPOST",
      },
    ],
  },
  formattedAddressed: [
    {
      buildingNumber: "1",
      thoroughfareName: "SOME ROAD",
      postTown: "SOMEWHERE",
      postcode: "SOMEPOST",
      text: "1, SOMEROAD, SOMEWHERE, SOMEPOST",
      value: "1, SOMEROAD, SOMEWHERE, SOMEPOST",
    },
    {
      buildingNumber: "NAMED BUILDING",
      thoroughfareName: "SOME ROAD",
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
