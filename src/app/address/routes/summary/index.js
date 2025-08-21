const express = require("express");
const steps = require("./steps");
const fields = require("./fields");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.query = req.query; // Makes ?edit=true available as query.edit
  next();
});

router.use(
  require("hmpo-form-wizard")(steps, fields, {
    name: "summary",
    journeyName: "addressCRI",
    templatePath: "summary",
  })
);

module.exports = router;
