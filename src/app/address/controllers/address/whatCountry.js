const { PACKAGE_NAME } = require("../../../../lib/config");
const BaseController = require("hmpo-form-wizard").Controller;

const logger = require("hmpo-logger").get(PACKAGE_NAME);

class WhatCountryController extends BaseController {
  getValues(req, res, callback) {
    logger.debug("What country controller: Entering get values");

    super.getValues(req, res, (err, values) => {
      values.country = "";
      if (err) {
        logger.warn("Calling callback with err: " + err);

        callback(err, values);
      } else {
        logger.debug("What country controller: calling callback");

        callback(null, values);
      }
    });

    logger.debug("What country controller: Exiting get values");
  }
}

module.exports = WhatCountryController;
