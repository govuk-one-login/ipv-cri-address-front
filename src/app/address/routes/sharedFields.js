const {
  postcodeLength,
  alphaNumeric,
  missingAlphaOrNumeric,
  isUkPostcode,
} = require("../validators/postcodeValidator");

const {
  alphaNumericWithSpecialChars,
  isPreviousYear,
} = require("../validators/addressValidator");

const { underMaxLength } = require("../validators/underMaxLengthValidator");

module.exports = {
  addressSearch: {
    type: "text",
    autocomplete: "postal-code",
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
  nonUKAddressApartmentNumber: {
    type: "text",
    validate: [
      {
        type: "underMaxLength",
        fn: underMaxLength,
        arguments: 30,
      },
      {
        type: "alphaNumericWithSpecialChars",
        fn: alphaNumericWithSpecialChars,
      },
    ],
  },
  nonUKAddressBuildingNumber: {
    type: "text",
    validate: [
      {
        type: "underMaxLength",
        fn: underMaxLength,
        arguments: 30,
      },
      {
        type: "alphaNumericWithSpecialChars",
        fn: alphaNumericWithSpecialChars,
      },
    ],
  },
  nonUKAddressBuildingName: {
    type: "text",
    validate: [
      {
        type: "underMaxLength",
        fn: underMaxLength,
        arguments: 50,
      },
      {
        type: "alphaNumericWithSpecialChars",
        fn: alphaNumericWithSpecialChars,
      },
    ],
  },
  nonUKAddressStreetName: {
    type: "text",
    validate: [
      {
        type: "underMaxLength",
        fn: underMaxLength,
        arguments: 60,
      },
      {
        type: "alphaNumericWithSpecialChars",
        fn: alphaNumericWithSpecialChars,
      },
    ],
  },
  nonUKAddressLocality: {
    type: "text",
    validate: [
      {
        type: "required",
      },
      {
        type: "underMaxLength",
        fn: underMaxLength,
        arguments: 60,
      },
      {
        type: "alphaNumericWithSpecialChars",
        fn: alphaNumericWithSpecialChars,
      },
    ],
  },
  nonUKAddressPostalCode: {
    type: "text",
    validate: [
      {
        type: "underMaxLength",
        fn: underMaxLength,
        arguments: 15,
      },
      {
        type: "alphaNumericWithSpecialChars",
        fn: alphaNumericWithSpecialChars,
      },
    ],
  },
  nonUKAddressRegion: {
    type: "text",
    validate: [
      {
        type: "underMaxLength",
        fn: underMaxLength,
        arguments: 60,
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
  nonUKAddressYearFrom: {
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
  addressBreak: {
    type: "radios",
    items: ["continue", "retry"],
    validate: ["required"],
  },
  addressResults: {
    type: "list",
    validate: [
      {
        type: "required",
      },
    ],
  },
};
