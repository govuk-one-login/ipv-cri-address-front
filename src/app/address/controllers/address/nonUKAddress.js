const BaseController = require("hmpo-form-wizard").Controller;
const {
  buildingAddressEmptyValidator,
} = require("../../validators/nonUKAddressValidator");
const { yearFrom, getCountry } = require("../../../../lib/helpers");
const {
  buildingAddressComponent,
} = require("../../components/buildingAddress");
const { PACKAGE_NAME } = require("../../../../lib/config");

const logger = require("hmpo-logger").get(PACKAGE_NAME);

class NonUKAddressController extends BaseController {
  getValues(req, res, callback) {
    logger.debug("Non UK address controller: Entering get values");

    super.getValues(req, res, (err, values) => {
      values.addressCountryName = getCountry(
        req.sessionModel.get("country")
      ).key;

      logger.debug("Non UK address controller: set values.addressCountryName");

      if (req?.form?.errors) {
        logger.debug("Non UK address controller: req.form.errors is true");

        const errorValues =
          buildingAddressComponent.getIndividualFieldErrorMessages(
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
          buildingAddressComponent.hasValidationError(
            "buildingAddressEmptyValidator",
            req.form.errors
          ) && {
            text: req.translate("validation.buildingAddressEmptyValidator"),
            visuallyHiddenText: "error",
          };
      }

      logger.warn("Calling callback with err: " + err);
      callback(err, values);
    });
  }

  validateFields(req, res, callback) {
    const buildingAddress = {
      nonUKAddressApartmentNumber: req.body["nonUKAddressApartmentNumber"],
      nonUKAddressBuildingNumber: req.body["nonUKAddressBuildingNumber"],
      nonUKAddressBuildingName: req.body["nonUKAddressBuildingName"],
    };

    buildingAddressComponent.validateBuildingAddressEmpty(
      req.form.options.fields,
      buildingAddress,
      buildingAddressEmptyValidator
    );

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
}

module.exports = NonUKAddressController;
