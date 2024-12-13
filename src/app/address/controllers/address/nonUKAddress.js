const BaseController = require("hmpo-form-wizard").Controller;
const {
  buildingAddressEmptyValidator,
} = require("../../validators/nonUKAddressValidator");
const { yearFrom, getCountry } = require("../../../../lib/helpers");

class NonUKAddressController extends BaseController {
  getValues(req, res, callback) {
    super.getValues(req, res, (err, values) => {
      values.addressCountryName = getCountry(
        req.sessionModel.get("country")
      ).key;

      Object.entries(req?.form?.errors || {})?.map(
        ([fieldName, validationAttribute]) =>
          validationAttribute.type !== "buildingAddressEmptyValidator" &&
          (values[`${fieldName}InValid`] = this.getInputFieldErrorMessage(
            req.translate,
            validationAttribute.key,
            validationAttribute.type
          ))
      );
      /*
       * Display a single error message for a missing entry in the input group (apartment, number, or name).
       * At least one entry is required; if none is provided, a validation message is displayed for the group.
       */
      values.buildingAddressEmptyErrorMessage = this.isBuildingAddressEmpty(
        req
      ) && {
        text: req.translate("validation.buildingAddressEmptyValidator"),
        visuallyHiddenText: "error",
      };

      callback(err, values);
    });
  }

  validateFields(req, res, callback) {
    const formFields = req.form.options.fields;
    const apartment = "nonUKAddressApartmentNumber";
    const number = "nonUKAddressBuildingNumber";
    const name = "nonUKAddressBuildingName";

    const buildingAddress = [
      [apartment, req.body[apartment]],
      [number, req.body[number]],
      [name, req.body[name]],
    ];

    buildingAddress.every(fieldIsEmpty) &&
      this.defaultToFirstField(formFields, apartment);

    super.validateFields(req, res, callback);
  }

  async saveValues(req, res, callback) {
    super.saveValues(req, res, () => {
      const addressCountry = req.sessionModel.get("country");
      const address = this.buildAddress(req.body, addressCountry);
      req.sessionModel.set("address", address);

      callback();
    });
  }

  buildAddress(
    {
      nonUKAddressApartmentNumber,
      nonUKAddressBuildingNumber,
      nonUKAddressBuildingName,
      nonUKAddressStreetName,
      nonUKAddressLocality,
      nonUKAddressPostalCode,
      nonUKAddressRegion,
      nonUKAddressYearFrom,
    },
    addressCountry
  ) {
    return {
      addressRegion: nonUKAddressRegion,
      addressLocality: nonUKAddressLocality,
      streetName: nonUKAddressStreetName,
      postalCode: nonUKAddressPostalCode,
      buildingNumber: nonUKAddressBuildingNumber,
      buildingName: nonUKAddressBuildingName,
      subBuildingName: nonUKAddressApartmentNumber,
      validFrom: yearFrom(nonUKAddressYearFrom),
      addressCountry,
    };
  }

  defaultToFirstField(formFields, first) {
    formFields[first].validate.push({
      fn: buildingAddressEmptyValidator,
    });
  }

  isBuildingAddressEmpty(req) {
    return Object.entries(req?.form?.errors || {})
      .map(([, value]) => value)
      .some((error) => error?.type === "buildingAddressEmptyValidator");
  }

  getInputFieldErrorMessage(translate, key, type) {
    return {
      text: translate(`${key}.validation.${type}`),
    };
  }
}

const fieldIsEmpty = ([, value]) => value.trim() === "";

module.exports = NonUKAddressController;
