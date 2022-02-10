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
    validate: [
      {
        type: "required",
      },
      {
        type: "minlength",
        arguments: [5],
      },
      {
        type: "maxlength",
        arguments: [8],
      },
    ],
  },
};
