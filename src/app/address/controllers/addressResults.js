const BaseController = require("hmpo-form-wizard").Controller;

class AddressResultsController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      locals.addressPostcode = req.sessionModel.get("addressPostcode");
      callback(null, locals);
    });
  }

  saveValues(req, res, callback) {
    super.saveValues(req, res, () => {
      try {
        const selectedAddress = req.body["address-selection"];
        const allAddresses = req.sessionModel.get("searchResults");

        const choosenAddress = allAddresses.find(
          (address) => address.text === selectedAddress
        );

        delete choosenAddress.value;
        delete choosenAddress.text;

        const sessionAddresses = req.sessionModel.get("addresses");

        const addresses = Array.isArray(sessionAddresses)
          ? sessionAddresses
          : [];

        addresses.push(choosenAddress);

        req.sessionModel.set("addresses", addresses);
        callback();
      } catch (err) {
        callback(err);
      }
    });
  }
}

module.exports = AddressResultsController;
