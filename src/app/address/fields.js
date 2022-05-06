const {
  postcodeLength,
  alphaNumeric,
  missingAlphaOrNumeric,
  isUkPostcode,
} = require("./validators/postcodeValidator");

module.exports = {
  "address-search": {
    type: "text",
    autocomplete: "Postcode",
    formatter: [
      {
        type: "removeSpaces",
        fn: (val) => val.replace(/\s+/g, ""),
      },
    ],
    validate: [
      {
        type: "required",
      },
      {
        type: "postcodeLength",
        fn: postcodeLength,
      },
      {
        type: "alphaNumeric",
        fn: alphaNumeric,
      },
      {
        type: "missingNumericOrAlpha",
        fn: missingAlphaOrNumeric,
      },
      {
        type: "isUkPostcode",
        fn: isUkPostcode,
      },
    ],
  },
};
