const address = require("./controllers/address");
const done = require("./controllers/done");
const search = require("./controllers/addressSearch");
const results = require("./controllers/addressResults");

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
    controller: results,
    fields: ["address-results"],
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
