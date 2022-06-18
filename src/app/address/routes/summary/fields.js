module.exports = {
  currentAddress: {
    journeyKey: "currentAddress",
    default: "",
  },
  previousAddress: {
    journeyKey: "previousAddress",
    default: "",
  },
  addresses: {
    journeyKey: "addresses",
    default: [],
  },
  isAddressMoreThanThreeMonths: {
    type: "radios",
    items: ["moreThanThreeMonths", "lessThanThreeMonths"],
    validate: [], // custom validator in addressConfirm.js
  },
};
