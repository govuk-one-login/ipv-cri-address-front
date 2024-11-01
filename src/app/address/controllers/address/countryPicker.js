const BaseController = require("hmpo-form-wizard").Controller;

const countryList = require("./countries.json");

class CountryPickerController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      locals.countries = countryList;

      callback(null, locals);
    });
  }
}

module.exports = CountryPickerController;
