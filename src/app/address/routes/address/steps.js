const address = require("../../controllers/address/manual");
const prepopulate = require("../../controllers/address/prepopulate");
const search = require("../../controllers/address/search");
const results = require("../../controllers/address/results");
const nonUKAddressController = require("../../controllers/address/nonUKAddress");
const whatCountryController = require("../../controllers/address/whatCountry");

module.exports = {
  "/": {
    resetJourney: true,
    entryPoint: true,
    skip: true,
    next: "prepopulate",
  },
  "/prepopulate": {
    controller: prepopulate,
    skip: true,
    next: [
      {
        field: "context",
        value: "international_user",
        next: "what-country",
      },
      "search",
    ],
  },
  "/what-country": {
    controller: whatCountryController,
    fields: ["country"],
    next: [
      ...["GB", "GG", "JE", "IM"].map((countryCode) => ({
        field: "country",
        value: countryCode,
        next: "search",
      })),
      "enter-non-UK-address",
    ],
  },
  "/search": {
    controller: search,
    fields: ["addressSearch"],
    next: [
      {
        field: "requestIsSuccessful",
        op: "===",
        value: true,
        next: "results",
      },
      "problem",
    ],
  },
  "/problem": {
    fields: ["addressBreak"],
    next: [
      {
        field: "addressBreak",
        value: "continue",
        next: "/address",
      },
      "/search",
    ],
  },
  "/results": {
    controller: results,
    fields: ["addressResults"],
    next: "address",
  },
  "/address": {
    controller: address,
    editable: true,
    continueOnEdit: true,
    prereqs: ["/search"],
    fields: [
      "addressFlatNumber",
      "addressHouseNumber",
      "addressHouseName",
      "addressStreetName",
      "addressLocality",
      "addressYearFrom",
    ],
    next: "/summary/confirm",
  },
  "/enter-non-UK-address": {
    controller: nonUKAddressController,
    editable: true,
    continueOnEdit: true,
    prereqs: ["/what-country"],
    fields: [
      "nonUKAddressApartmentNumber",
      "nonUKAddressBuildingNumber",
      "nonUKAddressBuildingName",
      "nonUKAddressStreetName",
      "nonUKAddressLocality",
      "nonUKAddressPostalCode",
      "nonUKAddressRegion",
      "nonUKAddressYearFrom",
    ],
    next: "/summary/non-UK-confirm",
  },
};
