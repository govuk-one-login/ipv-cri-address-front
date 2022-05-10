const BaseController = require("hmpo-form-wizard").Controller;

const {
  validateHouseNumberAndName,
} = require("../validators/addressValidator");

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
        values.addressPostcode =
          address?.postalCode || req.sessionModel.get("addressPostcode");
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

  validateFields(req, res, callback) {
    // add custom validator for houseName/Number check.
    const formFields = req.form.options.fields;
    const houseName = req.body.addressHouseName;
    const houseNumber = req.body.addressHouseNumber;

    formFields.addressHouseNumber?.validate.push({
      fn: validateHouseNumberAndName,
      arguments: [houseName],
      message: "Enter a house name or house number",
    });
    formFields.addressHouseName?.validate.push({
      fn: validateHouseNumberAndName,
      arguments: [houseNumber],
      message: "Enter a house name or house number",
    });

    super.validateFields(req, res, callback);
  }

  async saveValues(req, res, callback) {
    super.saveValues(req, res, () => {
      const isPreviousAddress = req.originalUrl.startsWith("/previous/address");
      const sessionsAddresses = req.sessionModel.get("addresses");
      const addresses = Array.isArray(sessionsAddresses)
        ? sessionsAddresses
        : [];

      let chosenAddress = {};
      if (req.originalUrl === "/previous/address/edit") {
        chosenAddress = addresses[1];
      } else if (req.originalUrl === "/address/edit") {
        chosenAddress = addresses[0];
      } else {
        chosenAddress = req.sessionModel.get("chosenAddress") || {}; // empty object if no address chosen on address results
      }

      const address = this.buildAddress(
        req.body,
        isPreviousAddress,
        chosenAddress
      );

      // only set postcode when we dont use OS response postcode
      if (!address.postalCode) {
        address.postalCode = req.sessionModel.get("addressPostcode");
      }

      if (isPreviousAddress) {
        addresses[1] = address;
      } else {
        addresses[0] = address;
      }

      req.sessionModel.set("addresses", addresses);
      callback();
    });
  }

  buildAddress(
    {
      addressFlatNumber,
      addressHouseNumber,
      addressHouseName,
      addressStreetName,
      addressLocality,
      addressYearFrom,
    } = undefined,
    isPreviousAddress,
    chosenAddress
  ) {
    // only want year from for current address
    let yearFrom = null;
    if (!isPreviousAddress) {
      yearFrom = new Date(addressYearFrom).toISOString().split("T")[0];
    }

    const address = {
      buildingNumber: addressFlatNumber || addressHouseNumber,
      buildingName: addressHouseName,
      streetName: addressStreetName,
      addressLocality,
      validFrom: yearFrom,
    };

    const isChanged = this.checkForChanges(address, chosenAddress);

    // any changed fields will be overwriten by 'address'
    // Retains all special fields (sub building name, UPRN etc)
    const updatedAddress = {
      ...chosenAddress,
      uprn: isChanged ? undefined : chosenAddress.uprn,
    };

    return { ...updatedAddress, ...address };
  }

  checkForChanges(reqBody, chosenAddress) {
    const hasChanged = Object.keys(reqBody).findIndex((addressField) => {
      const reqBodyValue = reqBody[addressField];
      const chosenAddressValue = chosenAddress[addressField];
      // handle if field is empty string in reqBody AND undefined in chosenAddress
      if (
        reqBodyValue === "" &&
        (chosenAddressValue === undefined || chosenAddressValue === "")
      ) {
        return false;
      }

      if (reqBodyValue !== undefined && chosenAddressValue !== undefined) {
        return reqBodyValue !== chosenAddressValue;
      }
    });

    return hasChanged !== -1;
  }
}
module.exports = AddressController;
