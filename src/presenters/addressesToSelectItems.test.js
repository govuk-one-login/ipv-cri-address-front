import { describe, it, beforeEach, expect, vi } from "vitest";
import { addressesToSelectItems } from "./addressesToSelectItems.js";

describe("Addresses to SelectItems Presenter", () => {
  let translate;

  beforeEach(() => {
    translate = vi.fn();
  });

  it("should use a default message for 0 items", () => {
    const addresses = [];

    addressesToSelectItems({ addresses, translate });

    expect(translate).to.have.been.calledWith(
      "addressSelect.addressFoundWithCount",
      { count: 0 }
    );
  });

  it("should use a addressesFound message for 1 item", () => {
    const addresses = [{}];

    addressesToSelectItems({ addresses, translate });

    expect(translate).to.have.been.calledWith(
      "addressSelect.addressFoundWithCount",
      { count: 1 }
    );
  });

  it("should return items from addresses", () => {
    const addresses = [
      {
        streetName: "street",
        addressLocality: "locality",
        buildingNumber: "00",
        postalCode: "Q1 1JK",
      },
      {
        streetName: "street1",
        addressLocality: "locality",
        buildingNumber: "11",
        postalCode: "Q1 1JK",
        subBuildingName: "flat 1",
      },
    ];

    translate.mockReturnValue("addressSelect.addressFoundWithCount");

    const items = addressesToSelectItems({ addresses, translate });

    expect(items).to.deep.equal([
      { text: "addressSelect.addressFoundWithCount", value: "" },
      {
        addressLocality: "locality",
        buildingNumber: "00",
        postalCode: "Q1 1JK",
        streetName: "street",
        text: "00 street, locality, Q1 1JK",
        value: "00 street, locality, Q1 1JK",
      },
      {
        addressLocality: "locality",
        buildingNumber: "11",
        postalCode: "Q1 1JK",
        streetName: "street1",
        subBuildingName: "flat 1",
        text: "flat 1 11 street1, locality, Q1 1JK",
        value: "flat 1 11 street1, locality, Q1 1JK",
      },
    ]);
  });
});
