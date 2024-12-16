const countryList = require("../app/address/data/countries.json");

const yearFrom = (year) =>
  year && !isNaN(new Date(year))
    ? new Date(year).toISOString().split("T")[0]
    : null;

const getCountry = (countryCode) =>
  countryList.find((country) => country.value === countryCode);

function getIndividualFieldErrorMessages(errors, validatorToSkip, translate) {
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
}

module.exports = {
  yearFrom,
  getCountry,
  getIndividualFieldErrorMessages,
};
