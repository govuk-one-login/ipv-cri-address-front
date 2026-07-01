import FormWizard from "hmpo-form-wizard";
import commonExpress from "@govuk-one-login/di-ipv-cri-common-express";

import { config } from "../../../../lib/config.js";

const logger = commonExpress.bootstrap.logger.get(config.PACKAGE_NAME);

const getAddressesPath = config.API.PATHS.GET_ADDRESSES;

export class AddressPrepopulateController extends FormWizard.Controller {
  async saveValues(req, res, callback) {
    req.session.prepopulatedPostcode = false;

    try {
      if (!req.session.tokenId) {
        logger.warn("No session ID, not attempting pre-population");
        return callback();
      }

      const apiResponse = await req.customFetch(getAddressesPath, {
        method: "GET",
        headers: {
          session_id: req.session.tokenId,
        },
      });

      const data = await apiResponse.json();

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
      logger.warn({ err: error }, "Error pre-populating address");
      callback();
    }
  }
}
