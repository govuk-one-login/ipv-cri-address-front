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
  hasPreviousUKAddressWithinThreeMonths: {
    type: "radios",
    items: ["yes", "no"],
    validate: [], // custom validator in addressConfirm.js
  },
};
