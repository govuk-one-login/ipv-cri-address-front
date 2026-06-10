import FormWizard from "hmpo-form-wizard";
import commonExpress from "@govuk-one-login/di-ipv-cri-common-express";

import { config } from "../../../../lib/config.js";
import { generateHTMLofNonUKAddress } from "../../../../presenters/addressPresenter.js";
import { saveAddresses } from "./utils/saveAddresses.js";

const logger = commonExpress.bootstrap.logger.get(config.PACKAGE_NAME);

const CHANGE_CURRENT_HREF = "/enter-non-UK-address?edit=true";

export class NonUKAddressConfirmController extends FormWizard.Controller {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      if (err) {
        return callback(err, locals);
      }

      const currentAddress = req.journeyModel.get("currentAddress");
      if (!currentAddress) {
        return callback(new Error("No address found"), locals);
      }

      locals.currentAddressRowValue = generateHTMLofNonUKAddress(
        req.translate,
        currentAddress
      );
      locals.validFromRow = new Date(currentAddress.validFrom).getFullYear();
      locals.changeCurrentHref = CHANGE_CURRENT_HREF;

      callback(null, locals);
    });
  }

  async saveValues(req, res, callback) {
    try {
      const currentAddress = req.journeyModel.get("currentAddress");

      if (!currentAddress) {
        return callback(new Error("No address found"));
      }

      await saveAddresses(req, [currentAddress]);

      super.saveValues(req, res, callback);
    } catch (error) {
      logger.warn({ err: error }, "Error submitting address");
      callback(error);
    }
  }
}
