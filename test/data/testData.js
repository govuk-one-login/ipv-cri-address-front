module.exports = {
  apiResponse: {
    data: {
      results: [
        {
          DPA: {
            ADDRESS: "1, SOME ROAD, SOMEWHERE, SOMEPOST",
            BUILDING_NUMBER: "1",
            THOROUGHFARE_NAME: "SOME ROAD",
            POST_TOWN: "SOMEWHERE",
            POSTCODE: "SOMEPOST",
          },
        },
        {
          DPA: {
            ADDRESS: "2, SOME ROAD, SOMEWHERE, SOMEPOST",
            BUILDING_NAME: "NAMED BUILDING",
            THOROUGHFARE_NAME: "SOME ROAD",
            POST_TOWN: "SOMEWHERE",
            POSTCODE: "SOMEPOST",
          },
        },
      ],
    },
  },
  formattedAddressed: [
    {
      buildingNumber: "1",
      streetName: "SOME ROAD",
      town: "SOMEWHERE",
      postcode: "SOMEPOST",
      label: "1, SOMEROAD, SOMEWHERE, SOMEPOST",
    },
    {
      buildingNumber: "NAMED BUILDING",
      streetName: "SOME ROAD",
      town: "SOMEWHERE",
      postcode: "SOMEPOST",
      label: "NAMED BUILDING, SOMEROAD, SOMEWHERE, SOMEPOST",
    },
  ],
};
