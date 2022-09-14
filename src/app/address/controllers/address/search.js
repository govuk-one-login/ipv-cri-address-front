const BaseController = require("hmpo-form-wizard").Controller;

const {
  API: {
    PATHS: { POSTCODE_LOOKUP },
  },
} = require("../../../../lib/config");

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
      req.sessionModel.set("checkDetailsHeader", false);
      req.sessionModel.set("addressPostcode", addressPostcode);
      callback();
    }
  }

  async search(axios, postcode, sessionId) {
    const headers = sessionId ? { session_id: sessionId } : undefined; // set the header to null should fail the req but pass the browser tests for now.

    const addressResults = await axios.get(`${POSTCODE_LOOKUP}/${postcode}`, {
      headers,
    });
    const addresses = addressResults.data;

    return addresses;
  }
}

module.exports = AddressSearchController;
