const countryList = require("../app/address/data/countries.json");

const yearFrom = (year) =>
  year && !isNaN(new Date(year))
    ? new Date(year).toISOString().split("T")[0]
    : null;

const getCountry = (countryCode) =>
  countryList.find((country) => country.value === countryCode);

function trimOnlyWhitespaceStrings(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => {
      if (typeof v === "string" && v.trim() === "") {
        return [k, ""];
      }
      return [k, v];
    })
  );
}

module.exports = {
  yearFrom,
  getCountry,
  trimOnlyWhitespaceStrings,
};
