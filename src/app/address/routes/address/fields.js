module.exports = {
  address: {
    journeyKey: "currentAddress",
  },
  country: {
    validate: [
      "required",
      { type: "equal", fn: (value) => !value.match(/Select/) },
    ],
  },
};
