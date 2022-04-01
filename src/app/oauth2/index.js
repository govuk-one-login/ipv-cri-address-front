const express = require("express");

const router = express.Router();

const {
  addAuthParamsToSession,
  redirectToCallback,
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
router.get("/callback", redirectToCallback);

module.exports = router;
