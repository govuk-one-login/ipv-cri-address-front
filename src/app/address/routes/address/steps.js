const address = require("../../controllers/address/manual");
const prepopulate = require("../../controllers/address/prepopulate");
const search = require("../../controllers/address/search");
const results = require("../../controllers/address/results");
const countryPicker = require("../../controllers/address/countryPicker");

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
        next: "country-picker",
      },
      "search",
    ],
  },
  "/country-picker": {
    controller: countryPicker,
    fields: ["countryPicker"],
    // TODO this should be removed
    entryPoint: true,
    // TODO this needs to be confirmed
    next: "international",
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
};
