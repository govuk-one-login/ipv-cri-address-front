const BaseController = require("hmpo-form-wizard").Controller;

class AddressController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      locals.addressPostcode = req.sessionModel.get("addressPostcode");

      const addresses = req.body["addresses"];
      // todo - get address of the selected address to edit (eg if user tries to edit previous address)
      const currentAddress = Array.isArray(addresses) ? addresses[0] : null;
      if (currentAddress) {
        locals.addressLine1 = currentAddress?.addressLine1;
        locals.addressLine2 = currentAddress?.addressLine2;
        locals.addressTown = currentAddress?.addressTown;
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
    const addressTownOrCity = reqBody.addressTownOrCity;
    // const addressValidFrom = reqBody.addressValidFrom; // todo

    const address = {
      buildingNumber: addressFlatNumber || addressHouseNumber,
      buildingName: addressHouseName,
      streetName: addressStreetName,
      addressLocality: addressTownOrCity,
    };

    return address;
  }
}
module.exports = AddressController;
