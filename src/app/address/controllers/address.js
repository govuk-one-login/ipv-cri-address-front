const BaseController = require("hmpo-form-wizard").Controller;

class AddressController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      locals.addressPostcode = req.sessionModel.get("addressPostcode");
      const address = req.sessionModel.get("chosenAddress");

      if (address) {
        locals.addressFlatNumber = address.addressFlatNumber;
        locals.addressHouseNumber = address.buildingNumber;
        locals.addressHouseName = address.buildingName;
        locals.addressStreetName = address.streetName;
        locals.addressLocality = address.addressLocality;
      }
      callback(null, locals);
    });
  }

  async saveValues(req, res, callback) {
    super.saveValues(req, res, () => {
      const address = this.buildAddress(req.body);
      address.postalCode = req.sessionModel.get("addressPostcode");

      const sessionsAddresses = req.sessionModel.get("addresses");

      const addresses = Array.isArray(sessionsAddresses)
        ? sessionsAddresses
        : [];

      addresses.push(address);

      req.sessionModel.set("addresses", addresses);
      callback();
    });
  }

  buildAddress(reqBody) {
    const addressFlatNumber = reqBody.addressFlatNumber || null;
    const addressHouseNumber = reqBody.addressHouseNumber || null;
    const addressHouseName = reqBody.addressHouseName || null;
    const addressStreetName = reqBody.addressStreetName;
    const addressLocality = reqBody.addressLocality;
    // const addressValidFrom = reqBody.addressValidFrom; // todo

    const address = {
      buildingNumber: addressFlatNumber || addressHouseNumber,
      buildingName: addressHouseName,
      streetName: addressStreetName,
      addressLocality,
    };

    return address;
  }
}
module.exports = AddressController;
