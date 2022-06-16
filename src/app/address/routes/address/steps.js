const address = require("../../controllers/address");
const search = require("../../controllers/addressSearch");
const results = require("../../controllers/addressResults");
const confirm = require("../../controllers/addressConfirm");

module.exports = {
  "/": {
    resetJourney: true,
    entryPoint: true,
    skip: true,
    next: "search",
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
    next: "confirm",
  },
  "/confirm": {
    controller: confirm,
    prereqs: "/address/edit",
    fields: ["addPrevious", "isAddressMoreThanThreeMonths"],
    next: [
      {
        field: "addPreviousAddresses",
        op: "===",
        value: true,
        next: "/previous/search",
      },
      "/oauth2/callback",
    ],
  },
};
