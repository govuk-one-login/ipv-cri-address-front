const BaseController = require("hmpo-form-wizard").Controller;

class WhatCountryController extends BaseController {
  async getValues(req, res, callback) {
    super.getValues(req, res, (err, values) => {
      values.country = "";
      callback(err, values);
    });
  }
}

module.exports = WhatCountryController;
