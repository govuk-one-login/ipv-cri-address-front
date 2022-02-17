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
    fields: ["address-search"],
    next: "results",
  },
  "/results": {
    controller: results,
    fields: ["address-results"],
    next: "confirm",
  },
  "/address": {
    controller: address,
    checkJourney: false,
    editable: true,
    next: "confirm",
  },
  "/confirm": {
    controller: confirm,
    next: "done",
  },
  // temporary display results
  "/done": {
    controller: done,
  },
};
