const BaseController = require("hmpo-form-wizard").Controller;
const logger = require("hmpo-logger").get("di-ipv-cri-address-front");
const {
  generateHTMLofAddress,
} = require("../../../../presenters/addressPresenter");

const {
  confirmationValidation,
} = require("../../validators/confirmationValidator");

const { API } = require("../../../../lib/config");
const {
  createPersonalDataHeaders,
} = require("@govuk-one-login/frontend-passthrough-headers");

class AddressConfirmController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      if (err) {
        return callback(err, locals);
      }

      const currentAddress = req.journeyModel.get("currentAddress");
      const previousAddress = req.journeyModel.get("previousAddress");

      if (!currentAddress) {
        return callback(new Error("No address found"), locals);
      }

      const currentAddressHtml = generateHTMLofAddress(currentAddress);
      const previousAddressHtml = previousAddress
        ? generateHTMLofAddress(previousAddress)
        : null;

      const yearFrom = new Date(currentAddress.validFrom).getFullYear();
      const today = new Date();

      // if no previous addresses + more info is required, then radio button menu is rendered
      if (!previousAddress) {
        locals.isMoreInfoRequired = this.isMoreInfoRequired(yearFrom, today);
      }
      locals.currentAddressRowValue = currentAddressHtml;
      locals.validFromRow = String(yearFrom);
      locals.previousAddressRowValue = previousAddressHtml;

      callback(null, locals);
    });
  }

  validateFields(req, res, callback) {
    const formFields = req.form.options.fields;
    const currentAddress = req.journeyModel.get("currentAddress");
    const previousAddress = req.journeyModel.get("previousAddress");

    const yearFrom = new Date(currentAddress.validFrom).getFullYear();
    const today = new Date();

    const isMoreInfoRequired = this.isMoreInfoRequired(yearFrom, today);

    // if we need more info and a previou address does not exist, add validation
    if (isMoreInfoRequired && !previousAddress) {
      formFields.hasPreviousUKAddressWithinThreeMonths?.validate.push({
        fn: confirmationValidation,
        arguments: [],
      });
    }

    super.validateFields(req, res, callback);
  }

  async saveValues(req, res, callback) {
    try {
      const hasPreviousUKAddressWithinThreeMonths =
        req.form.values.hasPreviousUKAddressWithinThreeMonths;
      if (hasPreviousUKAddressWithinThreeMonths === "yes") {
        // reset variables specific to current address journey
        req.sessionModel.set("addPreviousAddresses", true);
        callback();
      } else {
        const currentAddress = req.journeyModel.get("currentAddress");
        const previousAddress = req.journeyModel.get("previousAddress");

        if (!currentAddress && !previousAddress) {
          return callback(new Error("No address found"));
        }

        const addresses = [currentAddress];

        if (previousAddress) {
          addresses.push(previousAddress);
        }

        await this.saveAddressess(req, addresses);

        super.saveValues(req, res, () => {
          // if we're into save values we're finished with gathering addresses
          req.sessionModel.set("addPreviousAddresses", false);

          callback();
        });
      }
    } catch (error) {
      logger.warn("Error submitting address", error);

      callback(error);
    }
  }

  async saveAddressess(req, addresses) {
    // set the headers to undefined will a fail a production level request but pass the browser tests for now.
    const headers = req.session.tokenId
      ? {
          session_id: req.session.tokenId,
          "session-id": req.session.tokenId,
          ...createPersonalDataHeaders(
            `${API.BASE_URL}${API.PATHS.SAVE_ADDRESS}`,
            req
          ),
        }
      : createPersonalDataHeaders(
          `${API.BASE_URL}${API.PATHS.SAVE_ADDRESS}`,
          req
        );
    const resp = await req.axios.put(`${API.PATHS.SAVE_ADDRESS}`, addresses, {
      headers,
    });

    return resp.data;
  }

  // yearFrom = int
  // checkDate = date
  // return true if same year or cant tell if within 3 months
  isMoreInfoRequired(yearFrom, checkDate) {
    // constructor requires month
    if (checkDate.getFullYear() === yearFrom) {
      return true; // We dont know what month they moved.
    }

    const threeMonthsAgo = new Date(
      checkDate.getFullYear(),
      checkDate.getMonth() - 3
    );

    // If 3monthsAgo is still 2022 and yearFrom = 2021.
    // Return false
    // if 3monthsAgo is previous year 2021 and yearFrom = 2020
    // Return true
    return threeMonthsAgo.getFullYear() <= yearFrom;
  }
}

module.exports = AddressConfirmController;
