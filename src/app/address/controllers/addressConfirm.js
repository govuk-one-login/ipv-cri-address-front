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

      locals.formattedAddress = currentAddress;

      if (addresses.length) {
        locals.previousAddresses = addresses;
      }

      callback(null, locals);
    });
  }

  async saveValues(req, res, callback) {
    try {
      const addresses = req.sessionModel.get("addresses");
      const data = await this.saveAddressess(
        req.axios,
        addresses,
        req.session.tokenId
      );
      super.saveValues(req, res, () => {
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

    return `${buildingNameNumber}<br>${address.streetName},<br>${address.postTown},<br>${address.postcode}<br>`;
  }

  async saveAddressess(axios, addresses, sessionId) {
    // set the headers to undefined will a fail a production level request but pass the browser tests for now.
    const headers = sessionId ? { session_id: sessionId } : undefined;
    const resp = await axios.put(`${SAVE_ADDRESS}`, addresses, {
      headers,
    });

    return resp.data;
  }
}

module.exports = AddressConfirmController;
