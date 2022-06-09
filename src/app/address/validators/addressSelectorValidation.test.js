const { expect } = require("chai");
const { addressSelectorValidator } = require("./addressSelectorValidation");

describe("addressSelectorValidator", () => {
  it("should fail when UPRNs are the same", () => {
    const addressOne = {
      uprn: "123",
    };
    const addressTwo = {
      uprn: "123",
    };

    const result = addressSelectorValidator("", addressOne, addressTwo);

    expect(result).to.equal(false);
  });

  it("should pass when UPRNs are different", () => {
    const addressOne = {
      uprn: "123",
    };
    const addressTwo = {
      uprn: "124",
    };

    const result = addressSelectorValidator("", addressOne, addressTwo);

    expect(result).to.equal(true);
  });

  it("should pass when one UPRN is missing", () => {
    const addressOne = {
      uprn: "123",
    };
    const addressTwo = {
      uprn: "",
    };

    const result = addressSelectorValidator("", addressOne, addressTwo);

    expect(result).to.equal(true);
  });

  it("should pass when both UPRN are missing", () => {
    const addressOne = {
      uprn: "",
    };
    const addressTwo = {
      uprn: "",
    };

    const result = addressSelectorValidator("", addressOne, addressTwo);

    expect(result).to.equal(true);
  });

  it("should pass when both UPRN are null", () => {
    const addressOne = {
      uprn: null,
    };
    const addressTwo = {
      uprn: null,
    };

    const result = addressSelectorValidator("", addressOne, addressTwo);

    expect(result).to.equal(true);
  });
});
