const express = require("express");

const router = express.Router();

const {
  addAuthParamsToSession,
  redirectToCallback,
  initSessionWithJWT,
  redirectToEntryPoint,
  addJWTToRequest,
} = require("./middleware");

router.get(
  "/authorize",
  addAuthParamsToSession,
  addJWTToRequest,
  initSessionWithJWT,
  redirectToEntryPoint
);
router.get("/callback", redirectToCallback);

module.exports = router;
