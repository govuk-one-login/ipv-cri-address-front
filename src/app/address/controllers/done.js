const BaseController = require("hmpo-form-wizard").Controller;

class DoneController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      const jsonRequest = req.sessionModel.toJSON();

      const address = {
        Address: `${jsonRequest.addressLine1}<br>${jsonRequest.addressLine2}`,
        Town: `${jsonRequest.addressTown}`,
        County: `${jsonRequest.addressCounty}`,
        Postcode: `${jsonRequest.addressPostcode}`,
      };

      const formattedAddress = [];

      for (const [key, value] of Object.entries(address)) {
        formattedAddress.push({ key: { text: key }, value: { html: value } });
      }
      locals.formattedAddress = formattedAddress;
      callback(null, locals);
    });
  }
}

module.exports = DoneController;
