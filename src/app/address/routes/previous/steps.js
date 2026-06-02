import { AddressController } from "../../controllers/address/manual.js";
import { AddressSearchController } from "../../controllers/address/search.js";
import { AddressResultsController } from "../../controllers/address/results.js";

export const steps = {
  "/": {
    entryPoint: true,
    skip: true,
    next: "search",
  },
  "/search": {
    controller: AddressSearchController,
    fields: ["addressSearch"],
    entryPoint: true,
    next: [
      {
        field: "requestIsSuccessful",
        op: "===",
        value: true,
        next: "/previous/results",
      },
      "/previous/problem",
    ],
  },
  "/problem": {
    fields: ["addressBreak"],
    next: [
      {
        field: "addressBreak",
        value: "continue",
        next: "/previous/address",
      },
      "/previous/search",
    ],
  },
  "/results": {
    controller: AddressResultsController,
    fields: ["addressResults"],
    next: "/previous/address",
  },
  "/address": {
    controller: AddressController,
    editable: true,
    continueOnEdit: true,
    prereqs: ["/search"],
    fields: [
      "addressFlatNumber",
      "addressHouseNumber",
      "addressHouseName",
      "addressStreetName",
      "addressLocality",
    ],
    next: "/summary/confirm",
  },
};
