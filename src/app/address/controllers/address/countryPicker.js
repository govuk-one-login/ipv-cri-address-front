const BaseController = require("hmpo-form-wizard").Controller;

class InterantionalAddressController extends BaseController {
  locals(req, res) {
    console.log("🌽 international controller");

    return super.locals(req, res);
  }
}
module.exports = InterantionalAddressController;
