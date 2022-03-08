const BaseController = require("hmpo-form-wizard").Controller;

class AddressConfirmController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      const sessionAddresses = req.sessionModel.get("addresses");


      const addresses = sessionAddresses.map((address) => {
        return this.formatAddress(address);
      });

      const currentAddress = addresses.shift();

      locals.formattedAddress = currentAddress;

      // format previous addresses
      if (addresses.length) {
        locals.previousAddresses = addresses;
      }

      callback(null, locals);
    });
  }

  saveValues(req, res, callback) {
    super.saveValues(req, res, () => {
      // temporary until add previous addresses has been confirmed.
      const addPreviousAddresses = req.body.addPreviousAddresses !== null;
      req.sessionModel.set("addPreviousAddresses", addPreviousAddresses);
      callback();
    });
  }

  formatAddress(address) {
    return `${address.addressLine1}<br>${address.addressLine2},<br>${address.addressTown},<br>${address.addressPostcode}<br>`;
  }
}

module.exports = AddressConfirmController;
