import FormWizard from "hmpo-form-wizard";
import commonExpress from "@govuk-one-login/di-ipv-cri-common-express";
import { config } from "../../../../lib/config.js";

const logger = commonExpress.bootstrap.logger.get(config.PACKAGE_NAME);

export class WhatCountryController extends FormWizard.Controller {
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
