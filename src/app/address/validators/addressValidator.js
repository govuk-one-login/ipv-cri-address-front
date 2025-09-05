module.exports = {
  alphaNumericWithSpecialChars: function (val) {
    if (!val) {
      return true; // handle when field is optional
    }
    return !!val.match(/^[0-9A-Z'.,\\/* -]+$/i);
  },
  isPreviousYear: function (val) {
    return new Date(val).getFullYear() <= new Date().getFullYear();
  },
  isLessThanOneHundredYearsAgo: function (val) {
    return val > new Date().getFullYear() - 100;
  },
  ukBuildingAddressEmptyValidator: function (houseNumber, houseName) {
    const trimOrDefaultToEmpty = (value) =>
      value != null ? String(value).trim() : "";

    return trimOrDefaultToEmpty(houseNumber) || trimOrDefaultToEmpty(houseName);
  },
};
