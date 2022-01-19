const address = require("./controllers/controller");

module.exports = {
  "/": {
    resetJourney: true,
    entryPoint: true,
    skip: true,
    next: "address",
  },
  "/address": {
    fields: [
      "address-line-1",
      "address-line-2",
      "address-town",
      "address-county",
      "address-postcode",
    ],
    controller: address,
    next: "/",
  },
  // TODO additional address?
};
