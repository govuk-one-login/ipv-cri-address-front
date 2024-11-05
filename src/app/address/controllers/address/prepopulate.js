const BaseController = require("hmpo-form-wizard").Controller;
const logger = require("hmpo-logger").get();

const {
  API: {
    PATHS: { GET_ADDRESSES },
  },
} = require("../../../../lib/config");

class AddressPrepopulateController extends BaseController {
  async saveValues(req, res, callback) {
    req.session.prepopulatedPostcode = false;

    try {
      if (!req.session.tokenId) {
        logger.warn("No session ID, not attempting pre-population");
        return callback();
      }

      const { data } = await req.axios.get(`${GET_ADDRESSES}`, {
        headers: {
          session_id: req.session.tokenId,
        },
      });

      if (data?.context) {
        req.sessionModel.set("context", data.context);
      }

      if (data?.addresses?.length > 0) {
        req.session.prepopulatedPostcode = true;
        req.sessionModel.set("addressSearch", data.addresses[0].postalCode);
      }

      return super.saveValues(req, res, () => {
        callback();
      });
    } catch (error) {
      logger.warn("Error pre-populating address", error);
      callback();
    }
  }
}

module.exports = AddressPrepopulateController;
