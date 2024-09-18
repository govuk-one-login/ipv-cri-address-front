const BaseController = require("hmpo-form-wizard").Controller;
const countries = require('../../../../../node_modules/govuk-country-and-territory-autocomplete/dist/location-autocomplete-canonical-list.json')

class CountryController extends BaseController {
    locals(req, res, callback) {
      super.locals(req, res, (err, locals) => {
        if (err) {
          return callback(err, locals);
        }
        locals.countries = [{ value: "", text: "Select country or territory", attributes: { disabled: true, selected:true } }]
        countries.map(item => ({
          value: item[1],
          label: item[0]
        }));
          // locals.countries = [...local.countries, ...transformedList];
          callback(null, locals);
      });
    }
    saveValues(req, res, callback) {
      
      // const selectedCountry = transformedList.filter(item.value === "country") || transformedList.filter(item.value === "territory")
      const countrySelected = req.body.addressCountry.value;
      // req.sessionModel.get("address-country")
      req.session.country = countrySelected
      console.log("ABCDEF",req.body.addressCountry.value)
      // countryCode = country === "country"
      // territoryCode = country === "territory"
      // console.log("COUNTRIIIIES", req.body)
      super.saveValues(req, res, callback);
    }
  }

module.exports = CountryController;
