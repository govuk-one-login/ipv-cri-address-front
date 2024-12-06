const confirm = require("../../controllers/summary/confirm");
const nonUKConfirm = require("../../controllers/summary/nonUKConfirm");

module.exports = {
  "/confirm": {
    controller: confirm,
    entryPoint: true,
    fields: [
      "addPrevious",
      "hasPreviousUKAddressWithinThreeMonths",
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
  "/non-UK-confirm": {
    controller: nonUKConfirm,
    fields: ["currentAddress"],
    next: "/oauth2/callback",
  },
};
