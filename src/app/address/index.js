const express = require("express");

const steps = require("./steps");
const fields = require("./fields");
const { addAddressToSession } = require("./middleware/middleware");

const router = express.Router();

router.use(
  require("hmpo-form-wizard")(steps, fields, {
    name: "address",
    fields: [
      "address-line-1",
      "address-line-2",
      "address-town",
      "address-county",
      "address-postcode",
    ],
    journeyName: "address",
    templatePath: "address",
  })
);

router.post("/address", addAddressToSession);

module.exports = router;
