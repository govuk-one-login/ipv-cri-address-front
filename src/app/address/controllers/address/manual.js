const BaseController = require("hmpo-form-wizard").Controller;

const {
  validateHouseNumberAndName,
} = require("../../validators/addressValidator");

class AddressController extends BaseController {
  getValues(req, res, callback) {
    super.getValues(req, res, (err, values) => {
      const address = req.sessionModel.get("address");

      values.addressPostcode =
        address?.postalCode || req.sessionModel.get("addressPostcode");

      if (address) {
        values.addressFlatNumber = address.subBuildingName;
        values.addressHouseNumber = address.buildingNumber;
        values.addressHouseName = address.buildingName;
        values.addressStreetName = address.streetName;
        values.addressLocality = address.addressLocality;

        const yearFrom = address.validFrom
          ? new Date(address.validFrom).getFullYear()
          : null;
        values.addressYearFrom = yearFrom;
      }

      if (req.url.includes("edit")) {
        values.checkDetailsHeader = "false";
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
      const chosenAddress = req.sessionModel.get("address") || {}; // empty object if no address chosen on

      const address = this.buildAddress(req.body, chosenAddress);

      // only set postcode when we dont use OS response postcode
      if (!address.postalCode) {
        address.postalCode = req.sessionModel.get("addressPostcode");
      }

      req.sessionModel.set("address", address); // set for /edit routes

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
    chosenAddress
  ) {
    // only want year from for current address
    let yearFrom = null;

    if (addressYearFrom) {
      yearFrom = new Date(addressYearFrom).toISOString().split("T")[0];
    }

    const address = {
      subBuildingName: addressFlatNumber,
      buildingNumber: addressHouseNumber,
      buildingName: addressHouseName,
      streetName: addressStreetName,
      addressLocality,
      addressCountry: "GB",
      validFrom: yearFrom,
    };

    const isChanged = this.checkForChanges(address, chosenAddress);

    // any changed fields will be overwritten by 'address'
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
