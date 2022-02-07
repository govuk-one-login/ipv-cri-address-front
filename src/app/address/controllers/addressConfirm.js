const BaseController = require("hmpo-form-wizard").Controller;

class AddressConfirmController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      const buildingNumber = req.sessionModel.get("addressLine1");
      const streetName = req.sessionModel.get("addressLine2");
      const town = req.sessionModel.get("addressTown");
      const postcode = req.sessionModel.get("addressPostcode");

      const formattedAddress = `${buildingNumber}<br>${streetName},</br>${town},</br>${postcode},</br>`;

      locals.formattedAddress = formattedAddress;
      callback(null, locals);
    });
  }
}

module.exports = AddressConfirmController;
