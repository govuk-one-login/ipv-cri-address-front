import { AddressConfirmController } from "../../controllers/summary/confirm.js";
import { NonUKAddressConfirmController } from "../../controllers/summary/nonUKConfirm.js";

export const steps = {
  "/confirm": {
    controller: AddressConfirmController,
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
    controller: NonUKAddressConfirmController,
    fields: ["currentAddress"],
    next: "/oauth2/callback",
  },
};
