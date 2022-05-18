const address = require("./controllers/address");
const search = require("./controllers/addressSearch");
const results = require("./controllers/addressResults");
const confirm = require("./controllers/addressConfirm");

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
      "address",
    ],
  },
  "/results": {
    controller: results,
    fields: ["address-results"],
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
    field: ["addPrevious", "moreInfoRequired"],
    next: [
      {
        field: "addPreviousAddresses",
        op: "===",
        value: true,
        next: "previous/search",
      },
      "/oauth2/callback",
    ],
  },
  "/previous/search": {
    controller: search,
    fields: ["addressSearch"],
    next: [
      {
        field: "requestIsSuccessful",
        op: "===",
        value: true,
        next: "previous/results",
      },
      "previous/address",
    ],
  },
  "/previous/results": {
    controller: results,
    fields: ["address-results"],
    next: "previous/address",
  },
  "/previous/address": {
    controller: address,
    editable: true,
    continueOnEdit: true,
    prereqs: ["/previous/search"],
    fields: [
      "addressFlatNumber",
      "addressHouseNumber",
      "addressHouseName",
      "addressStreetName",
      "addressLocality",
    ],
    next: "confirm",
  },
};
