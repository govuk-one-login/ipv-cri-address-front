import FormWizard from "hmpo-form-wizard";
import commonExpress from "@govuk-one-login/di-ipv-cri-common-express";
import { createPersonalDataHeaders } from "@govuk-one-login/frontend-passthrough-headers";

import { config } from "../../../../lib/config.js";

const logger = commonExpress.bootstrap.logger.get(config.PACKAGE_NAME);

export class AddressSearchController extends FormWizard.Controller {
  locals(req, res) {
    res.locals.prepopulatedPostcode = req.session.prepopulatedPostcode;

    return super.locals(req, res);
  }

  async saveValues(req, res, callback) {
    req.session.prepopulatedPostcode = false;

    const addressPostcode = req.body["addressSearch"];

    req.sessionModel.unset("address");
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
      logger.warn(
        {
          component: "AddressSearchController",
          message: error.message,
        },
        "Error searching for address"
      );

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
            `${config.API.BASE_URL}${config.API.PATHS.POSTCODE_LOOKUP}`,
            req
          ),
        }
      : createPersonalDataHeaders(
          `${config.API.BASE_URL}${config.API.PATHS.POSTCODE_LOOKUP}`,
          req
        ); // set the header to null should fail the req but pass the browser tests for now.
    if (!req.session.tokenId) {
      logger.warn(
        {
          component: "AddressSearchController",
        },
        "Address lookup attempted without session token"
      );
    }

    let addressResults;

    try {
      addressResults = await req.customFetch(config.API.PATHS.POSTCODE_LOOKUP, {
        method: "POST",
        jsonBody: { postcode },
        headers,
      });
    } catch (error) {
      logger.warn(
        {
          component: "AddressSearchController",
          message: error.message,
        },
        "Address lookup API request threw an exception"
      );
      throw error;
    }

    const addresses = await addressResults.json();
    if (!addresses?.length) {
      logger.warn(
        {
          component: "AddressSearchController",
        },
        "Address lookup returned no results"
      );
    }
    logger.debug(
      {
        component: "AddressSearchController",
        resultCount: addresses?.length ?? 0,
      },
      "Address lookup completed"
    );
    return this.titleCaseAddresses(addresses);
  }

  titleCaseAddresses(addresses) {
    const titleCasedAddresses = addresses.map((address) => {
      const tempAddress = {};
      for (let key in address) {
        if (
          typeof address[key] === "string" &&
          key !== "postalCode" &&
          key !== "addressCountry"
        ) {
          tempAddress[key] = address[key].replaceAll(
            /\w\S*/g,
            (text) =>
              text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
          );
        } else {
          tempAddress[key] = address[key];
        }
      }
      return tempAddress;
    });
    return titleCasedAddresses;
  }
}
