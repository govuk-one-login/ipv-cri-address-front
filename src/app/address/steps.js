const address = require("./controllers/address");
const done = require("./controllers/done");
const search = require("./controllers/addressSearch");
const results = require("./controllers/addressResults");

module.exports = {
  "/": {
    resetJourney: true,
    entryPoint: true,
    skip: true,
    next: "postcode",
  },
  "/postcode": {
    controller: search,
    fields: ["address-lookup"],
    next: "results",
  },
  "/results": {
    controller: results,
    fields: ["address-selector"],
    next: "done",
  },
  "/address": {
    controller: address,
    next: "done",
  },
  // temporary display results
  "/done": {
    controller: done,
    noPost: true,
  },
};
