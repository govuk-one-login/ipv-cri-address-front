const BaseController = require("hmpo-form-wizard").Controller;

class AddressController extends BaseController {
  async saveValues(req, res, next) {
    // console.log(req.sessionModel.toJSON());

    super.saveValues(req, res, next);
  }
}
module.exports = AddressController;
