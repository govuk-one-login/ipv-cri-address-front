const {
  addressSelectorValidator,
} = require("../../validators/addressSelectorValidation");

const presenters = require("../../../../presenters");

const BaseController = require("hmpo-form-wizard").Controller;

class AddressResultsController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      if (err) {
        callback(err, locals);
      }

      locals.addressPostcode = req.sessionModel.get("addressPostcode");
      locals.addresses = presenters.addressesToSelectItems({
        addresses: req.sessionModel.get("searchResults"),
        translate: req.translate,
      });

      callback(null, locals);
    });
  }

  validateFields(req, res, callback) {
    const checkAddress = req.journeyModel.get("currentAddress");
    // only need to validate the address when there is another address already.
    if (checkAddress) {
      const formFields = req.form.options.fields;
      const selectedAddress = req.form.values.addressResults;
      const searchResults = req.sessionModel.get("searchResults");
      const chosenAddress = this.getAddress(selectedAddress, searchResults);

      formFields.addressResults?.validate.push({
        fn: addressSelectorValidator,
        arguments: [chosenAddress, checkAddress],
      });
    }

    super.validateFields(req, res, callback);
  }

  saveValues(req, res, callback) {
    super.saveValues(req, res, () => {
      try {
        const selectedAddress = req.form.values.addressResults;
        const searchResults = req.sessionModel.get("searchResults");

        const chosenAddress = this.getAddress(selectedAddress, searchResults);

        req.sessionModel.set("checkDetailsHeader", true);
        req.sessionModel.set("address", chosenAddress);

        callback();
      } catch (err) {
        callback(err);
      }
    });
  }

  getAddress(selectedAddress, searchResults) {
    const chosenAddress = Object.assign(
      {},
      searchResults.find(
        (address) =>
          presenters.addressPresenter.generateSearchResultString(address) ===
          selectedAddress
      )
    );

    return chosenAddress;
  }
}

module.exports = AddressResultsController;
