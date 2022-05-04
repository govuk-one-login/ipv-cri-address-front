const {
  postcodeLength,
  alphaNumeric,
  missingAlphaOrNumeric,
  isUkPostcode,
} = require("./validators/postcodeValidator");

module.exports = {
  "address-line-1": {
    type: "text",
    autocomplete: "address-line1",
  },
  "address-line-2": {
    type: "text",
    autocomplete: "address-line2",
  },
  "address-town": {
    type: "text",
    autocomplete: "address-line1",
  },
  "address-postcode": {
    type: "text",
    autocomplete: "Postcode",
  },
  "address-county": {
    type: "text",
    autocomplete: "address-level2",
  },
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
