const BaseController = require("hmpo-form-wizard").Controller;
const {
  buildingAddressEmptyValidator,
} = require("../../validators/nonUKAddressValidator");
const {
  yearFrom,
  getCountry,
  getIndividualFieldErrorMessages,
} = require("../../../../lib/helpers");

class NonUKAddressController extends BaseController {
  getValues(req, res, callback) {
    super.getValues(req, res, (err, values) => {
      values.addressCountryName = getCountry(
        req.sessionModel.get("country")
      ).key;

      if (req?.form?.errors) {
        const errorValues = getIndividualFieldErrorMessages(
          req.form.errors,
          "buildingAddressEmptyValidator",
          req.translate
        );

        values = { ...values, errors: { ...errorValues } };

        /*
         * Display a single error message for a missing entry in the input group (apartment, number, or name).
         * At least one entry is required; if none is provided, a validation message is displayed for the group.
         */
        values.errors.buildingAddressEmptyErrorMessage =
          this.isBuildingAddressEmpty(req.form.errors) && {
            text: req.translate("validation.buildingAddressEmptyValidator"),
            visuallyHiddenText: "error",
          };
      }

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

  isBuildingAddressEmpty(errors) {
    return Object.entries(errors || {})
      .map(([, value]) => value)
      .some((error) => error?.type === "buildingAddressEmptyValidator");
  }
}

const fieldIsEmpty = ([, value]) => value.trim() === "";

module.exports = NonUKAddressController;
