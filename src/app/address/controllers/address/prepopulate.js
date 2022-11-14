const BaseController = require("hmpo-form-wizard").Controller;

const {
  API: {
    PATHS: { GET_ADDRESSES },
  },
} = require("../../../../lib/config");

class AddressPrepopulateController extends BaseController {
  async saveValues(req, res, callback) {
    try {
      const prepopulatedAddresses = await req.axios.get(`${GET_ADDRESSES}`, {
        headers: {
          session_id: req.session.tokenId,
          "session-id": req.session.tokenId,
        },
      });

      console.log(prepopulatedAddresses.data);

      super.saveValues(req, res, () => {
        callback();
      });
    } catch (err) {
      callback();
    }
  }
}

module.exports = AddressPrepopulateController;
