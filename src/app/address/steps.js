const address = require("./controllers/address");
const done = require("./controllers/done");
const postcode = require("./controllers/postcodeLookup");

module.exports = {
  "/": {
    resetJourney: true,
    entryPoint: true,
    skip: true,
    next: "search",
  },
  "/search": {
    controller: search,
    fields: ["address-search"],
    next: "results",
  },
  "/results": {
    controller: postcode, // todo change
    fields: [""],
    next: "done",
  },
  "/address": {
    controller: address,
    next: "done",
  },
  // temporary display results
  "/done": {
    controller: done,
    skip: false,
    noPost: true,
  },
};
