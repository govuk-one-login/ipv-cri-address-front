const { PACKAGE_NAME } = require("../../../../lib/config");
const BaseController = require("hmpo-form-wizard").Controller;

const logger = require("hmpo-logger").get(PACKAGE_NAME);

class WhatCountryController extends BaseController {
  async getValues(req, res, callback) {
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
