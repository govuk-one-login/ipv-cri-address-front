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
      const buildingNumber = req.body["addressLine1"];
      const streetName = req.body["addressLine2"];
      const postTown = req.body["addressTown"];
      const postcode = req.sessionModel.get("addressPostcode");
      const address = {
        buildingNumber,
        streetName,
        postTown,
        postcode,
      };
      const sessionsAddresses = req.sessionModel.get("addresses");

      const addresses = Array.isArray(sessionsAddresses)
        ? sessionsAddresses
        : [];

      addresses.push(address);

      req.sessionModel.set("addresses", addresses);
      callback();
    });
  }
}
module.exports = AddressController;
