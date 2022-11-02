const BaseController = require("hmpo-form-wizard").Controller;

const {
  API: {
    PATHS: { GET_ADDRESSES },
  },
} = require("../../../../lib/config");

class AddressPrepopulateController extends BaseController {
  async saveValues(req, res, callback) {
    try {
      const addresses = await req.axios.get(`${GET_ADDRESSES}`, {
        headers: {
          session_id: req.session.tokenId,
          "session-id": req.session.tokenId,
        },
      });

      super.saveValues(req, res, () => {
        req.sessionModel.set("requestIsSuccessful", true);

        if (addresses?.data?.result?.addresses?.length) {
          const address = addresses?.data?.result?.addresses[0];
          req.sessionModel.set("addressSearch", address.postalCode);
        }

        callback();
      });
    } catch (err) {
      req.sessionModel.set("requestIsSuccessful", false);
      callback();
    }
  }
}

module.exports = AddressPrepopulateController;
