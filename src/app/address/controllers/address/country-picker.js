const BaseController = require("hmpo-form-wizard").Controller;
const countries = require('../../../../../node_modules/govuk-country-and-territory-autocomplete/dist/location-autocomplete-canonical-list.json')

class CountryController extends BaseController {
    locals(req, res, callback) {
      super.locals(req, res, (err, locals) => {
        if (err) {
          return callback(err, locals);
        }
          locals.countries = countries
          callback(null, locals);
      });
    }
  }
module.exports = CountryController;
