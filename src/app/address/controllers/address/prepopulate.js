const BaseController = require("hmpo-form-wizard").Controller;

const {
  API: {
    PATHS: { GET_ADDRESSES },
  },
} = require("../../../../lib/config");

class AddressPrepopulateController extends BaseController {
  async saveValues(req, res, callback) {
    req.session.prepopulatedPostcode = false;

    try {
      const prepopulatedAddresses = await req.axios.get(`${GET_ADDRESSES}`, {
        headers: {
          session_id: req.session.tokenId,
          "session-id": req.session.tokenId,
        },
      });

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
