const BaseController = require("hmpo-form-wizard").Controller;

class AddressController extends BaseController {
  async saveValues(req, res, next) {
    req.sessionModel.set("addressLine1", req.body["address-line-1"]);
    req.sessionModel.set("addressLine2", req.body["address-line-2"]);
    req.sessionModel.set("addressTown", req.body["address-town"]);
    req.sessionModel.set("addressCounty", req.body["address-county"]);
    req.sessionModel.set("addressPostcode", req.body["address-postcode"]);

    super.saveValues(req, res, next);
  }
}
module.exports = AddressController;
