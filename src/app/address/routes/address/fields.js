const countryList = require("./countries.json");

module.exports = {
  address: {
    journeyKey: "currentAddress",
  },
  countryPicker: {
    type: "select",
    legend: "",
    label: "",
    hint: "",
    placeholder: true,
    items: countryList,
    validate: [
      "required",
      { type: "equal", fn: (value) => !value.match(/Select/) },
    ],
  },
};
