const BaseController = require("hmpo-form-wizard").Controller;
const { logger } = require("../../../../lib/logger");

const {
  generateHTMLofNonUKAddress,
} = require("../../../../presenters/addressPresenter");

const saveAddressess = require("./utils/saveAddresses");

const CHANGE_CURRENT_HREF = "/enter-non-UK-address?edit=true";

class NonUKAddressConfirmController extends BaseController {
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

      await saveAddressess(req, [currentAddress]);

      super.saveValues(req, res, callback);
    } catch (error) {
      logger.warn("Error submitting address", error);
      callback(error);
    }
  }
}

module.exports = NonUKAddressConfirmController;
