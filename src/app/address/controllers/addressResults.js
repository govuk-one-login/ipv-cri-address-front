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
        const selectedAddress = req.body.addressResults;
        const allAddresses = req.sessionModel.get("searchResults");

        const chosenAddress = Object.assign(
          {},
          allAddresses.find((address) => address.text === selectedAddress)
        ); // force deep copy

        delete chosenAddress.value;
        delete chosenAddress.text;

        req.sessionModel.set("chosenAddress", chosenAddress);
        callback();
      } catch (err) {
        callback(err);
      }
    });
  }
}

module.exports = AddressResultsController;
