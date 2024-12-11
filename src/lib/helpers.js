const countryList = require("../app/address/data/countries.json");

const yearFrom = (year) =>
  year && !isNaN(new Date(year))
    ? new Date(year).toISOString().split("T")[0]
    : null;

const getCountry = (countryCode) =>
  countryList.find((country) => country.value === countryCode);

function addIndividualFieldErrorMessages(validator, req, values) {
  Object.entries(req?.form?.errors || {})?.map(
    ([fieldName, validationAttribute]) =>
      validationAttribute.type !== `${validator}` &&
      (values[`${fieldName}Invalid`] = getInputFieldErrorMessage(
        req.translate,
        validationAttribute.key,
        validationAttribute.type
      ))
  );
}

function getInputFieldErrorMessage(translate, key, type) {
  return {
    text: translate(`${key}.validation.${type}`),
  };
}

module.exports = { yearFrom, getCountry, addIndividualFieldErrorMessages };
