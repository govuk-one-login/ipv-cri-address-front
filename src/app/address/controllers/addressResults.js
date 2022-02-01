const BaseController = require("hmpo-form-wizard").Controller;

class AddressResultsController extends BaseController {
  saveValues(req, res, next) {
    const selectedAddress = req.body["address-selection"];
    const allAddresses = req.sessionModel.get("searchResults");

    const choosenAddress = allAddresses.find(
      (address) => address.label === selectedAddress
    );

    req.sessionModel.set("addressLine1", choosenAddress.buildingNumber);
    req.sessionModel.set("addressLine2", choosenAddress.streetName);
    req.sessionModel.set("addressTown", choosenAddress.town);
    req.sessionModel.set("addressPostcode", choosenAddress.postcode);
    super.saveValues(req, res, next);
  }
}

module.exports = AddressResultsController;
