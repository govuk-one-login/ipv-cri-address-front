const { buildingAddressEmptyValidator } = require("./nonUKAddressValidator");

describe("buildingAddressEmptyValidator", function () {
  it("returns true if apartmentNumber is non-empty", () => {
    const result = buildingAddressEmptyValidator("A1", "", "");

    expect(result).to.equal("A1");
  });

  it("returns true if buildingNumber is non-empty", () => {
    const result = buildingAddressEmptyValidator("", "45", "");

    expect(result).to.equal("45");
  });

  it("returns true if buildingName is non-empty", () => {
    const result = buildingAddressEmptyValidator(
      "",
      "",
      "White Chapel building"
    );

    expect(result).to.be.ok;
  });

  it("returns the first non-empty field (apartmentNumber)", () => {
    const result = buildingAddressEmptyValidator(
      "A1",
      "45",
      "White Chapel building"
    );

    expect(result).to.equal("A1");
  });

  it("returns the first non-empty field (buildingNumber)", function () {
    const result = buildingAddressEmptyValidator(
      "",
      "45",
      "White Chapel building"
    );

    expect(result).to.equal("45");
  });

  it("returns the first non-empty field (buildingName)", () => {
    const result = buildingAddressEmptyValidator(
      "",
      "",
      "White Chapel building"
    );

    expect(result).to.equal("White Chapel building");
  });

  it("returns empty string if all inputs are empty strings", () => {
    const result = buildingAddressEmptyValidator("", "", "");

    expect(result).to.equal("");
  });

  it("returns empty string if all inputs are null", () => {
    const result = buildingAddressEmptyValidator(null, null, null);

    expect(result).to.equal("");
  });

  it("returns empty if all inputs are undefined", () => {
    const result = buildingAddressEmptyValidator(
      undefined,
      undefined,
      undefined
    );

    expect(result).to.equal("");
  });

  it("handles mixed empty strings, null, and undefined", () => {
    const result = buildingAddressEmptyValidator(
      "",
      null,
      "White Chapel building"
    );

    expect(result).to.equal("White Chapel building");
  });

  it("trims whitespace from inputs", () => {
    const result = buildingAddressEmptyValidator(
      "  A1  ",
      "  45  ",
      "  White Chapel building  "
    );
    expect(result).to.equal("A1");
  });

  it("handles all inputs being whitespace", () => {
    const result = buildingAddressEmptyValidator("  ", "  ", "  ");

    expect(result).to.equal("");
  });

  it("handles numeric inputs", () => {
    const result = buildingAddressEmptyValidator(123, 456, 789);

    expect(result).to.equal("123");
  });

  it("handles a mix of numeric and string inputs", () => {
    const result = buildingAddressEmptyValidator(0, "45", null);

    expect(result).to.equal("0");
  });

  it("handles boolean inputs (true/false)", () => {
    const result = buildingAddressEmptyValidator(true, false, "Apartment");

    expect(result).to.equal("true");
  });

  it("handles inputs with special characters", () => {
    const result = buildingAddressEmptyValidator("@#", "!$%", "^&*()");

    expect(result).to.equal("@#");
  });

  it("prioritizes non-empty fields in order (apartmentNumber > buildingNumber > buildingName)", () => {
    const result = buildingAddressEmptyValidator(
      "A1",
      "45",
      "White Chapel building"
    );

    expect(result).to.equal("A1");
  });
});
