const BaseController = require("hmpo-form-wizard").Controller;

const {
  API: {
    PATHS: { POSTCODE_LOOKUP },
  },
} = require("../../../lib/config");

class AddressSearchController extends BaseController {
  async saveValues(req, res, callback) {
    const addressPostcode = req.body["addressSearch"];

    try {
      const addressPostcode = req.body["addressSearch"];
      const searchResults = await this.search(
        req.axios,
        addressPostcode,
        req.session.tokenId
      );
      super.saveValues(req, res, () => {
        req.sessionModel.set("requestIsSuccessful", true);
        req.sessionModel.set("searchResults", searchResults);
        req.sessionModel.set("addressPostcode", addressPostcode);
        callback();
      });
    } catch (err) {
      req.sessionModel.set("requestIsSuccessful", false);
      req.sessionModel.set("addressPostcode", addressPostcode);
      callback();
    }
  }

  async search(axios, postcode, sessionId) {
    const headers = sessionId ? { session_id: sessionId } : undefined; // set the header to null should fail the req but pass the browser tests for now.

    const addressResults = await axios.get(`${POSTCODE_LOOKUP}/${postcode}`, {
      headers,
    });
    const addresses = addressResults.data.map(this.addLabel);

    const defaultMessage = {
      text: `${addresses.length} addresses found`,
      value: "",
    };

    return [defaultMessage, ...addresses];
  }

  // add a pretty print for drop down menu.
  // need text + value to be the same to suit the framework.
  addLabel(address) {
    let buildingNames = [];
    let streetNames = [];
    let localityNames = [];

    // handle building name
    if (address.organisationName) {
      buildingNames.push(address.organisationName);
    }
    if (address.departmentName) {
      buildingNames.push(address.departmentName);
    }
    if (address.buildingName) {
      buildingNames.push(address.buildingName);
    }
    if (address.subBuildingName) {
      buildingNames.push(address.subBuildingName);
    }
    if (address.buildingNumber) {
      buildingNames.push(address.buildingNumber);
    }

    // street names
    if (address.dependentStreetName) {
      streetNames.push(address.dependentStreetName);
    }
    if (address.streetName) {
      streetNames.push(address.streetName);
    }

    // locality names
    if (address.doubleDependentAddressLocality) {
      localityNames.push(address.doubleDependentAddressLocality);
    }
    if (address.dependentAddressLocality) {
      localityNames.push(address.dependentAddressLocality);
    }
    if (address.addressLocality) {
      localityNames.push(address.addressLocality);
    }

    const fullBuildingName = buildingNames.join(" ");
    const fullStreetName = streetNames.join(" ");
    const fullLocality = localityNames.join(" ");
    const text = `${fullBuildingName} ${fullStreetName}, ${fullLocality}, ${address.postalCode}`;

    return { ...address, text, value: text };
  }
}

module.exports = AddressSearchController;
