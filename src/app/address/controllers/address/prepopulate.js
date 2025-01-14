const {
  API: {
    PATHS: { GET_ADDRESSES },
  },
  PACKAGE_NAME,
} = require("../../../../lib/config");

const BaseController = require("hmpo-form-wizard").Controller;
const logger = require("hmpo-logger").get(PACKAGE_NAME);

class AddressPrepopulateController extends BaseController {
  async saveValues(req, res, callback) {
    logger.debug("Pre-populate controller: Entering save values");
    req.session.prepopulatedPostcode = false;

    try {
      if (!req.session.tokenId) {
        logger.warn("No session ID, not attempting pre-population");
        return callback();
      }

      logger.debug("Pre-populate controller: calling /addresses endpoint");

      const { data } = await req.axios.get(`${GET_ADDRESSES}`, {
        headers: {
          session_id: req.session.tokenId,
        },
      });

      logger.debug(
        "Pre-populate controller: got response from /addresses endpoint"
      );

      if (data?.context) {
        req.sessionModel.set("context", data.context);
        logger.debug(
          "Pre-populate controller: set session model context value"
        );
      }

      if (data?.addresses?.length > 0) {
        req.session.prepopulatedPostcode = true;
        req.sessionModel.set("addressSearch", data.addresses[0].postalCode);
        logger.debug(
          "Pre-populate controller: set session model postalCode value"
        );
      }

      return super.saveValues(req, res, () => {
        logger.debug("Pre-populate controller: calling callback");
        callback();
      });
    } catch (error) {
      logger.warn("Error pre-populating address", error);
      callback();
    }
  }
}

module.exports = AddressPrepopulateController;
