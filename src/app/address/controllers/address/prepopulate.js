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
    } catch (error) {
      logger.warn("Error pre-populating address", error);
      callback();
    }
  }
}

module.exports = AddressPrepopulateController;
