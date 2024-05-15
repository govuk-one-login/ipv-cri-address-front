const BaseController = require("hmpo-form-wizard").Controller;

const { API } = require("../../../../lib/config");
const {
  createPersonalDataHeaders,
} = require("@govuk-one-login/frontend-passthrough-headers");

class AddressPrepopulateController extends BaseController {
  async saveValues(req, res, callback) {
    req.session.prepopulatedPostcode = false;

    const headers = {
      "session-id": req.session.tokenId,
      session_id: req.session.tokenId,
      ...createPersonalDataHeaders(
        `${API.BASE_URL}${API.PATHS.GET_ADDRESSES}`,
        req
      ),
    };

    try {
      const prepopulatedAddresses = await req.axios.get(
        `${API.PATHS.GET_ADDRESSES}`,
        {
          headers,
        }
      );

      if (prepopulatedAddresses?.data?.length > 0) {
        req.session.prepopulatedPostcode = true;
        req.sessionModel.set(
          "addressSearch",
          prepopulatedAddresses.data[0].postalCode
        );
      }

      return super.saveValues(req, res, () => {
        callback();
      });
    } catch (err) {
      callback();
    }
  }
}

module.exports = AddressPrepopulateController;
