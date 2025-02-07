const { PACKAGE_NAME } = require("../lib/config");
const logger = require("hmpo-logger").get(PACKAGE_NAME);

module.exports = {
  missingRedirectErrorHandler: async (err, req, res, next) => {
    if (err.message === "Missing redirect_uri") {
      logger.warn("Missing redirect_uri");
      res.status(400);
      res.render("errors/error");
    } else {
      next(err);
    }
  },
};
