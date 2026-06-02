import { countryList } from "../../data/countries.js";

export const fields = {
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
