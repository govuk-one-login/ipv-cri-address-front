const BaseController = require("hmpo-form-wizard").Controller;

class AddressResultsController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      locals.searchValue = req.sessionModel.get("searchValue");
      callback(null, locals);
    });
  }

  saveValues(req, res, callback) {
    super.saveValues(req, res, () => {
      try {
        const selectedAddress = req.body["address-selection"];
        const allAddresses = req.sessionModel.get("searchResults");

        const choosenAddress = allAddresses.find(
          (address) => address.label === selectedAddress
        );

        req.sessionModel.set("addressLine1", choosenAddress.buildingNumber);
        req.sessionModel.set("addressLine2", choosenAddress.streetName);
        req.sessionModel.set("addressTown", choosenAddress.town);
        req.sessionModel.set("addressPostcode", choosenAddress.postcode);
        callback();
      } catch (err) {
        callback(err);
      }
    });
  }
}

module.exports = AddressResultsController;
