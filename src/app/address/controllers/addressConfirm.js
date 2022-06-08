const BaseController = require("hmpo-form-wizard").Controller;

const { generateHTMLofAddress } = require("../presenters/addressPresenter");

const {
  confirmationValidation,
} = require("../validators/confirmationValidator");

const {
  API: {
    PATHS: { SAVE_ADDRESS },
  },
} = require("../../../lib/config");

class AddressConfirmController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      const sessionAddresses = req.sessionModel.get("addresses");

      const addresses = sessionAddresses.map((address) => {
        const addressHtml = generateHTMLofAddress(address);
        return { ...address, text: addressHtml };
      });

      const currentAddress = addresses.shift();
      const previousAddress = addresses.shift();

      const yearFrom = new Date(currentAddress.validFrom).getFullYear();
      const today = new Date();

      // if no previous addresses + more info is required, then radio button menu is rendered
      locals.isMoreInfoRequired =
        this.isMoreInfoRequired(yearFrom, today) && !previousAddress;
      locals.currentAddressRowValue = currentAddress.text;
      locals.validFromRow = String(yearFrom);
      locals.previousAddressRowValue = previousAddress?.text;

      callback(null, locals);
    });
  }

  validateFields(req, res, callback) {
    // add custom validator for houseName/Number check.
    const formFields = req.form.options.fields;
    const addresses = req.sessionModel.get("addresses");
    const hasPreviousAddresses = addresses.length === 2 ? true : false;

    const currentAddress = addresses[0];

    const yearFrom = new Date(currentAddress.validFrom).getFullYear();
    const today = new Date();

    const isMoreInfoRequired = this.isMoreInfoRequired(yearFrom, today);

    if (isMoreInfoRequired) {
      formFields.isAddressMoreThanThreeMonths?.validate.push({
        fn: confirmationValidation,
        arguments: [hasPreviousAddresses],
      });
    }

    super.validateFields(req, res, callback);
  }

  async saveValues(req, res, callback) {
    try {
      const isAddressMoreThanThreeMonths =
        req.form.values.isAddressMoreThanThreeMonths;
      if (isAddressMoreThanThreeMonths === "lessThanThreeMonths") {
        // reset variables specific to current address journey
        req.sessionModel.set("addressSearch", null);
        req.sessionModel.set("addPreviousAddresses", true);
        callback();
      } else {
        const addresses = req.sessionModel.get("addresses");

        await this.saveAddressess(req.axios, addresses, req.session.tokenId);

        super.saveValues(req, res, () => {
          // if we're into save values we're finished with gathering addresses
          req.sessionModel.set("addPreviousAddresses", false);

          callback();
        });
      }
    } catch (err) {
      callback(err);
    }
  }

  async saveAddressess(axios, addresses, sessionId) {
    // set the headers to undefined will a fail a production level request but pass the browser tests for now.
    const headers = sessionId ? { session_id: sessionId } : undefined;
    const resp = await axios.put(`${SAVE_ADDRESS}`, addresses, {
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
