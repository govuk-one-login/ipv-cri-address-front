const countryList = require("../app/address/data/countries.json");

const yearFrom = (year) =>
  year && !isNaN(new Date(year))
    ? new Date(year).toISOString().split("T")[0]
    : null;

const getCountry = (countryCode) =>
  countryList.find((country) => country.value === countryCode);

module.exports = { yearFrom, getCountry };
