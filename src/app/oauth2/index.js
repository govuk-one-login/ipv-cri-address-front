const express = require("express");

const router = express.Router();

const {
  addAuthParamsToSession,
  redirectToCallback,
  retrieveAuthorizationCode,
} = require("./middleware");

router.get("/authorize", addAuthParamsToSession, redirectToCallback);
router.post("/authorize", retrieveAuthorizationCode, redirectToCallback);

module.exports = router;
