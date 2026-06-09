import FormWizard from "hmpo-form-wizard";
import commonExpress from "@govuk-one-login/di-ipv-cri-common-express";

import { buildingAddressComponent } from "../../components/buildingAddress.js";
import { buildingAddressEmptyValidator } from "../../validators/nonUKAddressValidator.js";
import {
  yearFrom,
  getCountry,
  trimOnlyWhitespaceStrings,
} from "../../../../lib/helpers.js";
import { config } from "../../../../lib/config.js";

const logger = commonExpress.bootstrap.logger.get(config.PACKAGE_NAME);

export class NonUKAddressController extends FormWizard.Controller {
  getValues(req, res, callback) {
    super.getValues(req, res, (err, values) => {
      values.addressCountryName = getCountry(
        req.sessionModel.get("country")
      ).key;

      if (req?.form?.errors) {
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
      const address = this.buildAddress(
        trimOnlyWhitespaceStrings(req.body),
        addressCountry
      );
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
