const address = require("./controllers/address");

module.exports = {
  "/": {
    resetJourney: true,
    entryPoint: true,
    skip: true,
    next: "address",
  },
  "/address": {
    controller: address,
    next: "/",
  },
};
