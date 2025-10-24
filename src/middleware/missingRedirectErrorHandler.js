const { logger } = require("../lib/logger");

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
