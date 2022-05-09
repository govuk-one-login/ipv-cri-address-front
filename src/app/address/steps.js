const address = require("./controllers/address");
const done = require("./controllers/done");
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
    prereqs: "/address/edit", // can enter confirm if coming from address edit
    field: ["addPrevious"],
    next: [
      {
        field: "addPreviousAddresses",
        op: "===",
        value: true,
        next: "previous",
      },
      "/oauth2/callback",
    ],
  },
  "/previous": {
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
  // temporary display results
  "/done": {
    controller: done,
  },
};
