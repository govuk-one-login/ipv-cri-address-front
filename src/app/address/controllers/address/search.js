const BaseController = require("hmpo-form-wizard").Controller;
const logger = require("hmpo-logger").get();
const { API } = require("../../../../lib/config");
const {
  createPersonalDataHeaders,
} = require("@govuk-one-login/frontend-passthrough-headers");

class AddressSearchController extends BaseController {
  locals(req, res) {
    res.locals.prepopulatedPostcode = req.session.prepopulatedPostcode;

    return super.locals(req, res);
  }

  async saveValues(req, res, callback) {
    req.session.prepopulatedPostcode = false;

    const addressPostcode = req.body["addressSearch"];

    req.sessionModel.set("addressSearch", addressPostcode);

    try {
      const addressPostcode = req.body["addressSearch"];
      const searchResults = await this.search(req, addressPostcode);
      super.saveValues(req, res, () => {
        req.sessionModel.set("requestIsSuccessful", true);
        req.sessionModel.set("searchResults", searchResults);
        req.sessionModel.set("addressPostcode", addressPostcode);
        callback();
      });
    } catch (error) {
      logger.warn("Error searching for address", error);

      req.sessionModel.set("requestIsSuccessful", false);
      req.sessionModel.set("checkDetailsHeader", false);
      req.sessionModel.set("addressPostcode", addressPostcode);
      callback();
    }
  }

  async search(req, postcode) {
    const headers = req.session.tokenId
      ? {
          session_id: req.session.tokenId,
          "session-id": req.session.tokenId,
          ...createPersonalDataHeaders(
            `${API.BASE_URL}${API.PATHS.POSTCODE_LOOKUP}/${postcode}`,
            req
          ),
        }
      : createPersonalDataHeaders(
          `${API.BASE_URL}${API.PATHS.POSTCODE_LOOKUP}/${postcode}`,
          req
        ); // set the header to null should fail the req but pass the browser tests for now.

    const addressResults = await req.axios.get(
      `${API.PATHS.POSTCODE_LOOKUP}/${postcode}`,
      {
        headers,
      }
    );
    const addresses = addressResults.data;

    return addresses;
  }
}

module.exports = AddressSearchController;
