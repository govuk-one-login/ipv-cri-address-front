const address = require("./controllers/address");
const done = require("./controllers/done");

module.exports = {
  "/": {
    resetJourney: true,
    entryPoint: true,
    skip: true,
    next: "address",
  },
  "/address": {
    controller: address,
    next: "done",
  },
  "/done": {
    controller: done,
    skip: false,
  },
};
