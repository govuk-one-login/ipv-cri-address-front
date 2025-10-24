const BaseController = require("hmpo-form-wizard").Controller;
const { logger } = require("../../../../lib/logger");

class WhatCountryController extends BaseController {
  getValues(req, res, callback) {
    super.getValues(req, res, (err, values) => {
      values.country = "";
      if (err) {
        logger.warn("Calling callback with err: " + err);
        callback(err, values);
      } else {
        callback(null, values);
      }
    });
  }
}

module.exports = WhatCountryController;
