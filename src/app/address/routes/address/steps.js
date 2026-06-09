import { AddressController } from "../../controllers/address/manual.js";
import { AddressPrepopulateController } from "../../controllers/address/prepopulate.js";
import { AddressSearchController } from "../../controllers/address/search.js";
import { AddressResultsController } from "../../controllers/address/results.js";
import { NonUKAddressController } from "../../controllers/address/nonUKAddress.js";
import { WhatCountryController } from "../../controllers/address/whatCountry.js";

export const steps = {
  "/": {
    resetJourney: true,
    entryPoint: true,
    skip: true,
    next: "prepopulate",
  },
  "/prepopulate": {
    controller: AddressPrepopulateController,
    skip: true,
    next: [
      {
        field: "context",
        value: "international_user",
        next: "what-country",
      },
      "search",
    ],
  },
  "/what-country": {
    controller: WhatCountryController,
    fields: ["country"],
    next: [
      ...["GB", "GG", "JE", "IM"].map((countryCode) => ({
        field: "country",
        value: countryCode,
        next: "search",
      })),
      "enter-non-UK-address",
    ],
  },
  "/search": {
    controller: AddressSearchController,
    fields: ["addressSearch"],
    next: [
      {
        field: "requestIsSuccessful",
        op: "===",
        value: true,
        next: "results",
      },
      "problem",
    ],
  },
  "/problem": {
    fields: ["addressBreak"],
    next: [
      {
        field: "addressBreak",
        value: "continue",
        next: "/address",
      },
      "/search",
    ],
  },
  "/results": {
    controller: AddressResultsController,
    fields: ["addressResults"],
    next: "address",
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
      "addressYearFrom",
    ],
    next: "/summary/confirm",
  },
  "/enter-non-UK-address": {
    controller: NonUKAddressController,
    editable: true,
    continueOnEdit: true,
    prereqs: ["/what-country"],
    fields: [
      "nonUKAddressApartmentNumber",
      "nonUKAddressBuildingNumber",
      "nonUKAddressBuildingName",
      "nonUKAddressStreetName",
      "nonUKAddressLocality",
      "nonUKAddressPostalCode",
      "nonUKAddressRegion",
      "nonUKAddressYearFrom",
    ],
    next: "/summary/non-UK-confirm",
  },
};
