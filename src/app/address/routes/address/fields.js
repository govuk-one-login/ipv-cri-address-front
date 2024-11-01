module.exports = {
  address: {
    journeyKey: "currentAddress",
  },
  countryPicker: {
    validate: [
      "required",
      { type: "equal", fn: (value) => !value.match(/Select/) },
    ],
  },
};
