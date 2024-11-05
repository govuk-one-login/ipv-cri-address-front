const BaseController = require("hmpo-form-wizard").Controller;

const countryList = require("./countries.json");

class CountryPickerController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      locals.countries = countryList;

      callback(null, locals);
    });
  }

  async saveValues(req, res, callback) {
    super.saveValues(req, res, () => {
      console.log("🍏", req.sessionModel.get("country"));

      callback();
    });
  }
}

module.exports = CountryPickerController;
