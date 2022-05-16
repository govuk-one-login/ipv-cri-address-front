const {
  postcodeLength,
  alphaNumeric,
  missingAlphaOrNumeric,
  isUkPostcode,
} = require("./validators/postcodeValidator");

const {
  alphaNumericWithSpecialChars,
  isPreviousYear,
} = require("./validators/addressValidator");

module.exports = {
  addressSearch: {
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
  addressFlatNumber: {
    type: "text",
    validate: [
      {
        type: "maxlength",
        fn: "maxlength",
        arguments: [30],
      },
      {
        type: "alphaNumericWithSpecialChars",
        fn: alphaNumericWithSpecialChars,
      },
    ],
  },
  addressHouseNumber: {
    type: "text",
    validate: [
      {
        type: "maxlength",
        fn: "maxlength",
        arguments: [10],
      },
      {
        type: "alphaNumericWithSpecialChars",
        fn: alphaNumericWithSpecialChars,
      },
    ],
  },
  addressHouseName: {
    type: "text",
    validate: [
      {
        type: "maxlength",
        fn: "maxlength",
        arguments: [50],
      },
      {
        type: "alphaNumericWithSpecialChars",
        fn: alphaNumericWithSpecialChars,
      },
    ],
  },
  addressStreetName: {
    type: "text",
    validate: [
      {
        type: "required",
      },
      {
        type: "maxlength",
        fn: "maxlength",
        arguments: [60],
      },
      {
        type: "alphaNumericWithSpecialChars",
        fn: alphaNumericWithSpecialChars,
      },
    ],
  },
  addressLocality: {
    type: "text",
    validate: [
      {
        type: "required",
      },
      {
        type: "maxlength",
        fn: "maxlength",
        arguments: [60],
      },
      {
        type: "alphaNumericWithSpecialChars",
        fn: alphaNumericWithSpecialChars,
      },
    ],
  },
  addressYearFrom: {
    type: "number",
    validate: [
      {
        type: "required",
      },
      {
        type: "date-year",
      },
      {
        type: "isPreviousDate",
        fn: isPreviousYear,
      },
    ],
  },
  moreInfoRequired: {
    type: "radio",
    validate: [
      {
        type: "required",
      },
    ],
  },
};
