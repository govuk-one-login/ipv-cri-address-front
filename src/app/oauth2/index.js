const express = require("express");

const router = express.Router();

const {
  addAuthParamsToSession,
  redirectToCallback,
  retrieveAuthorizationCode,
  initSessionWithJWT,
  redirectToAddress,
  addJWTToRequest,
} = require("./middleware");

router.get(
  "/authorize",
  addAuthParamsToSession,
  addJWTToRequest,
  initSessionWithJWT,
  redirectToAddress
);
router.post("/authorize", retrieveAuthorizationCode, redirectToCallback);

module.exports = router;
