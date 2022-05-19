const BaseController = require("hmpo-form-wizard").Controller;

class AddressController extends BaseController {
  getValues(req, res, callback) {
    super.getValues(req, res, (err, values) => {
      const addresses = req.sessionModel.get("addresses");
      let address;

      if (req.originalUrl === "/previous/address/edit") {
        // edit previous address
        address = addresses[1];
        values.addressPostcode = address.postalCode;
      } else if (req.originalUrl === "/address/edit") {
        // edit current address
        address = addresses[0];
        values.addressPostcode = address.postalCode;
      } else {
        // edit the chosen address
        address = req.sessionModel.get("chosenAddress");
        values.addressPostcode = req.sessionModel.get("addressPostcode");
      }

      if (address) {
        values.addressFlatNumber = address.addressFlatNumber;
        values.addressHouseNumber = address.buildingNumber;
        values.addressHouseName = address.buildingName;
        values.addressStreetName = address.streetName;
        values.addressLocality = address.addressLocality;

        const yearFrom = address.validFrom
          ? new Date(address.validFrom).getFullYear()
          : null;
        values.addressYearFrom = yearFrom;
      }
      callback(null, values);
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
