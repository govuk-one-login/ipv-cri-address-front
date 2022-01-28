const address = require("./controllers/address");
const done = require("./controllers/done");
const postcode = require("./controllers/postcodeLookup");

module.exports = {
  "/": {
    resetJourney: true,
    entryPoint: true,
    skip: true,
    next: "postcode",
  },
  "/postcode": {
    controller: postcode,
    fields: ["address-postcode"],
    next: "/results",
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
  "/done": {
    controller: done,
    skip: false,
    noPost: true,
  },
};
