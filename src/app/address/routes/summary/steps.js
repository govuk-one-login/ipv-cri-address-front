const confirm = require("../../controllers/summary/confirm");

module.exports = {
  "/confirm": {
    controller: confirm,
    entryPoint: true,
    fields: [
      "addPrevious",
      "isAddressMoreThanThreeMonths",
      "currentAddress",
      "previousAddress",
    ],
    next: [
      {
        field: "addPreviousAddresses",
        op: "===",
        value: true,
        next: "/previous",
      },
      "/oauth2/callback",
    ],
  },
};
