const BaseController = require("hmpo-form-wizard").Controller;

class AddressController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      const addresses = req.sessionModel.get("addresses");
      let address;

      if (req.originalUrl === "/previous/address/edit") {
        // edit previous address
        address = addresses[1];
        locals.addressPostcode = address.postalCode;
      } else if (req.originalUrl === "/address/edit") {
        // edit current address
        address = addresses[0];
        locals.addressPostcode = address.postalCode;
      } else {
        // edit the chosen address
        address = req.sessionModel.get("chosenAddress");
        locals.addressPostcode = req.sessionModel.get("addressPostcode");
      }

      if (address) {
        locals.addressFlatNumber = address.addressFlatNumber;
        locals.addressHouseNumber = address.buildingNumber;
        locals.addressHouseName = address.buildingName;
        locals.addressStreetName = address.streetName;
        locals.addressLocality = address.addressLocality;

        const yearFrom = address.validFrom
          ? new Date(address.validFrom).getFullYear()
          : null;
        locals.addressYearFrom = yearFrom;
      }
      callback(null, locals);
    });
  }

  async saveValues(req, res, callback) {
    super.saveValues(req, res, () => {
      const isPreviousAddress = req.originalUrl.startsWith("/previous/address");

      const address = this.buildAddress(req.body, isPreviousAddress);

      address.postalCode = req.sessionModel.get("addressPostcode");

      const sessionsAddresses = req.sessionModel.get("addresses");

      const addresses = Array.isArray(sessionsAddresses)
        ? sessionsAddresses
        : [];

      if (isPreviousAddress) {
        addresses[1] = address;
      } else {
        addresses[0] = address;
      }

      req.sessionModel.set("addresses", addresses);
      callback();
    });
  }

  buildAddress(reqBody, isPreviousAddress) {
    const addressFlatNumber = reqBody.addressFlatNumber || null;
    const addressHouseNumber = reqBody.addressHouseNumber || null;
    const addressHouseName = reqBody.addressHouseName || null;
    const addressStreetName = reqBody.addressStreetName;
    const addressLocality = reqBody.addressLocality;

    // only want year from for current address
    let addressYearFrom = null;
    if (!isPreviousAddress) {
      addressYearFrom = new Date(reqBody.addressYearFrom)
        .toISOString()
        .split("T")[0];
    }

    const address = {
      buildingNumber: addressFlatNumber || addressHouseNumber,
      buildingName: addressHouseName,
      streetName: addressStreetName,
      addressLocality,
      validFrom: addressYearFrom,
    };

    return address;
  }
}
module.exports = AddressController;
