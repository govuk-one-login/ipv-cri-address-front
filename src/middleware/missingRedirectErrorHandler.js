import { config } from "../lib/config.js";
import commonExpress from "@govuk-one-login/di-ipv-cri-common-express";
const logger = commonExpress.bootstrap.logger.get(config.PACKAGE_NAME);

export function missingRedirectErrorHandler(err, req, res, next) {
  if (err.message === "Missing redirect_uri") {
    logger.warn("Missing redirect_uri");
    res.status(400);
    res.render("errors/error");
  } else {
    next(err);
  }
}
