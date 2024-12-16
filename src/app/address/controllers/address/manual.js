const BaseController = require("hmpo-form-wizard").Controller;
const {
  yearFrom,
  getIndividualFieldErrorMessages,
} = require("../../../../lib/helpers");

const {
  ukBuildingAddressEmptyValidator,
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

      if (req?.form?.errors) {
        const errorValues = getIndividualFieldErrorMessages(
          req.form.errors,
          "ukBuildingAddressEmptyValidator",
          req.translate
        );

        values = { ...values, errors: { ...errorValues } };

        /*
         * Display a single error message for a missing entry in the input group (house name or number).
         * At least one entry is required; if none is provided, a validation message is displayed for the group.
         */
        values.errors.ukBuildingAddressEmptyValidator =
          this.isBuildingAddressEmpty(req.form.errors) && {
            text: req.translate("validation.ukBuildingAddressEmptyValidator"),
            visuallyHiddenText: "error",
          };
      }

      callback(null, values);
    });
  }

  validateFields(req, res, callback) {
    const formFields = req.form.options.fields;
    const number = "addressHouseNumber";
    const name = "addressHouseName";

    const buildingAddress = [
      [number, req.body[number]],
      [name, req.body[name]],
    ];

    buildingAddress.every(fieldIsEmpty) &&
      this.defaultToFirstField(formFields, number);

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
    const validFrom = yearFrom(addressYearFrom);

    const address = {
      subBuildingName: addressFlatNumber,
      buildingNumber: addressHouseNumber,
      buildingName: addressHouseName,
      streetName: addressStreetName,
      addressLocality,
      addressCountry: "GB",
      validFrom,
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

  defaultToFirstField(formFields, first) {
    formFields[first].validate.push({
      fn: ukBuildingAddressEmptyValidator,
    });
  }

  isBuildingAddressEmpty(errors) {
    return Object.entries(errors || {})
      .map(([, value]) => value)
      .some((error) => error?.type === "ukBuildingAddressEmptyValidator");
  }
}
const fieldIsEmpty = ([, value]) => value.trim() === "";
module.exports = AddressController;
