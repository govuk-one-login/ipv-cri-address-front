const address = require("../../controllers/address");
const search = require("../../controllers/addressSearch");
const results = require("../../controllers/addressResults");

module.exports = {
  "/search": {
    controller: search,
    fields: ["addressSearch"],
    entryPoint: true,
    next: [
      {
        field: "requestIsSuccessful",
        op: "===",
        value: true,
        next: "/previous/results",
      },
      "/previous/problem",
    ],
  },
  "/problem": {
    fields: ["addressBreak"],
    next: [
      {
        field: "addressBreak",
        value: "continue",
        next: "/previous/address",
      },
      "/previous/search",
    ],
  },
  "/results": {
    controller: results,
    fields: ["addressResults"],
    next: "/previous/address",
  },
  "/address": {
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
    next: "/confirm",
  },
};
