const countryList = require("../../data/countries.json");

module.exports = {
  address: {
    journeyKey: "currentAddress",
  },
  country: {
    items: countryList,
    type: "select",
    hint: "",
    validate: [
      "required",
      { type: "equal", fn: (value) => !value.match(/Select/) },
    ],
  },
};
