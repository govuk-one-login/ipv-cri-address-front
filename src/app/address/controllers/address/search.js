const BaseController = require("hmpo-form-wizard").Controller;

const {
  API: {
    BASE_URL,
    PATHS: { POSTCODE_LOOKUP },
  },
} = require("../../../../lib/config");
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
      const searchResults = await this.search(
        req,
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

  async search(req, postcode, sessionId) {
    const defaultHeaders = createPersonalDataHeaders(
      `${BASE_URL}/${POSTCODE_LOOKUP}`,
      req
    );

    const headers = sessionId
      ? { session_id: sessionId, "session-id": sessionId, ...defaultHeaders }
      : undefined; // set the header to null should fail the req but pass the browser tests for now.

    const addressResults = await req.axios.get(
      `${POSTCODE_LOOKUP}/${postcode}`,
      {
        headers,
      }
    );
    const addresses = addressResults.data;

    return addresses;
  }
}

module.exports = AddressSearchController;
