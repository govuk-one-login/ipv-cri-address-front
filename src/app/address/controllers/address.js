const BaseController = require("hmpo-form-wizard").Controller;

class AddressController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      locals.addressPostcode =  req.sessionModel.get("addressPostcode");
      locals.addressLine1 = req.sessionModel.get("addressLine1");
      locals.addressLine2 = req.sessionModel.get("addressLine2");
      locals.addressTown = req.sessionModel.get("addressTown");
      callback(null, locals);
    });
  }

  async saveValues(req, res, next) {
    req.sessionModel.set("addressLine1", req.body["addressLine1"]);
    req.sessionModel.set("addressLine2", req.body["addressLine2"]);
    req.sessionModel.set("addressTown", req.body["addressTown"]);

    super.saveValues(req, res, next);
  }
}
module.exports = AddressController;
