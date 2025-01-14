const BaseController = require("hmpo-form-wizard").Controller;

class WhatCountryController extends BaseController {
  async getValues(req, res, callback) {
    super.getValues(req, res, (err, values) => {
      values.country = "";
      if (err) {
        callback(err, values);
      } else {
        callback(null, values);
      }
    });
  }
}

module.exports = WhatCountryController;
