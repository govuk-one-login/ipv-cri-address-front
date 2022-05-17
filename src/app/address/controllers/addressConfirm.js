const BaseController = require("hmpo-form-wizard").Controller;

const {
  API: {
    PATHS: { SAVE_ADDRESS },
  },
} = require("../../../lib/config");

class AddressConfirmController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      const sessionAddresses = req.sessionModel.get("addresses");

      const addresses = sessionAddresses.map((address) => {
        return this.formatAddress(address);
      });

      const currentAddress = addresses.shift();
      const previousAddress = addresses.shift();

      const yearFrom = new Date(currentAddress.validFrom).getFullYear();
      const today = new Date();

      locals.addPreviousAddresses = !req.sessionModel.get(
        "addPreviousAddresses"
      );
      locals.isMoreInfoRequirred = this.isMoreInfoRequired(yearFrom, today);
      locals.currentAddressRowValue = currentAddress.text;
      locals.validFromRow = String(yearFrom);
      locals.previousAddressRowValue = previousAddress?.text;

      callback(null, locals);
    });
  }

  async saveValues(req, res, callback) {
    try {
      const moreInfoRequired = req.body.moreInfoRequired;
      if (moreInfoRequired) {
        // reset variables specific to current address journey
        req.sessionModel.set("addressSearch", null);
        req.sessionModel.set("addPreviousAddresses", true);
        callback();
      } else {
        const addresses = req.sessionModel.get("addresses");
        const data = await this.saveAddressess(
          req.axios,
          addresses,
          req.session.tokenId
        );

        super.saveValues(req, res, () => {
          // if we're into save values we're finished with gathering addresses
          req.sessionModel.set("addPreviousAddresses", false);
          req.sessionModel.set("redirect_url", data.redirect_uri);
          req.sessionModel.set("state", data.state);

          if (!data.code) {
            const error = {
              code: "server_error",
              error_description: "Failed to retrieve authorization code",
            };

            req.sessionModel.set("error", error);
          } else {
            req.sessionModel.set("authorization_code", data.code);
          }
          callback();
        });
      }
    } catch (err) {
      callback(err);
    }
  }

  formatAddress(address) {
    let buildingNameNumber;
    if (address.buildingName && address.buildingNumber) {
      buildingNameNumber = `${address.buildingNumber} ${address.buildingName}`;
    } else {
      buildingNameNumber = address.buildingName || address.buildingNumber;
    }

    const text = `${buildingNameNumber}<br>${address.streetName},<br>${address.addressLocality},<br>${address.postalCode}<br>`;
    return { ...address, text };
  }

  async saveAddressess(axios, addresses, sessionId) {
    // set the headers to undefined will a fail a production level request but pass the browser tests for now.
    const headers = sessionId ? { session_id: sessionId } : undefined;
    const resp = await axios.put(`${SAVE_ADDRESS}`, addresses, {
      headers,
    });

    return resp.data;
  }

  // yearFrom = int
  // checkDate = date
  // return true if same year or cant tell if within 3 months
  isMoreInfoRequired(yearFrom, checkDate) {
    // constructor requires month
    if (checkDate.getFullYear() === yearFrom) {
      return true; // We dont know what month they moved.
    }

    const threeMonthsAgo = new Date(
      checkDate.getFullYear(),
      checkDate.getMonth() - 3
    );

    // If 3monthsAgo is still 2022 and yearFrom = 2021.
    // Return false
    // if 3monthsAgo is previous year 2021 and yearFrom = 2020
    // Return true
    return threeMonthsAgo.getFullYear() <= yearFrom;
  }
}

module.exports = AddressConfirmController;
