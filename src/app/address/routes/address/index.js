const express = require("express");
const steps = require("./steps");
const sharedFields = require("../sharedFields");
const fields = require("./fields");

const router = express.Router();

const allFields = {
  ...fields,
  ...sharedFields,
};

router.use((req, res, next) => {
  res.locals.query = req.query; // Makes ?edit=true available as query.edit
  next();
});

router.use(
  require("hmpo-form-wizard")(steps, allFields, {
    name: "address",
    journeyName: "addressCRI",
    templatePath: "address",
  })
);

module.exports = router;
