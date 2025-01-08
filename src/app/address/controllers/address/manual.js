const BaseController = require("hmpo-form-wizard").Controller;
const { yearFrom } = require("../../../../lib/helpers");

const {
  buildingAddressComponent,
} = require("../../components/buildingAddress");

const {
  ukBuildingAddressEmptyValidator,
} = require("../../validators/addressValidator");

class AddressController extends BaseController {
  getValues(req, res, callback) {
    super.getValues(req, res, (err, values) => {
      const address = req.sessionModel.get("address");

      values.addressPostcode =
        (address && address?.postalCode) ||
        req.sessionModel.get("addressPostcode");

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
        const errorValues =
          buildingAddressComponent.getIndividualFieldErrorMessages(
            req.form.errors,
            "ukBuildingAddressEmptyValidator",
            req.translate
          );

        values = { ...values, errors: { ...errorValues } };

        values.errors.ukBuildingAddressEmptyValidator =
          buildingAddressComponent.hasValidationError(
            "ukBuildingAddressEmptyValidator",
            req.form.errors
          ) && {
            text: req.translate("validation.ukBuildingAddressEmptyValidator"),
            visuallyHiddenText: "error",
          };
      }
      callback(null, values);
    });
  }

  validateFields(req, res, callback) {
    const buildingAddress = {
      addressHouseNumber: req.body["addressHouseNumber"],
      addressHouseName: req.body["addressHouseName"],
    };
    buildingAddressComponent.validateBuildingAddressEmpty(
      req.form.options.fields,
      buildingAddress,
      ukBuildingAddressEmptyValidator
    );
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
}
module.exports = AddressController;
