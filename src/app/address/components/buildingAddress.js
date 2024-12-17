const buildingAddressComponent = {
  getIndividualFieldErrorMessages(errors, validatorToSkip, translate) {
    return Object.entries(errors)?.reduce(
      (errorValues, [fieldName, { type, key }]) => {
        if (type !== `${validatorToSkip}`) {
          errorValues[fieldName] = {
            text: translate(`${key}.validation.${type}`),
          };
        }
        return errorValues;
      },
      {}
    );
  },

  validateBuildingAddressEmpty(formFields, buildingAddress, validator) {
    Object.values(buildingAddress).every(fieldIsEmpty) &&
      this.defaultToFirstField(
        formFields,
        Object.keys(buildingAddress)[0],
        validator
      );
  },

  defaultToFirstField(formFields, first, validator) {
    formFields[first].validate.push({
      fn: validator,
    });
  },

  hasValidationError(validatorName, errors) {
    return Object.entries(errors || {})
      .map(([, value]) => value)
      .some((error) => error?.type === validatorName);
  },
};

const fieldIsEmpty = (field) => field.trim() === null || field.trim() === "";

module.exports = { buildingAddressComponent };
