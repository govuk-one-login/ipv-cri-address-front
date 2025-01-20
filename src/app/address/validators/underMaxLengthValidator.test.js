const { underMaxLength } = require("./underMaxLengthValidator");

describe("underMaxLengthValidator", () => {
  it("should return true when under max length", () => {
    const result = underMaxLength("UnderTen", 10);
    expect(result).to.equal(true);
  });

  it("should return false when over max length", () => {
    const result = underMaxLength("OverTennnnn", 10);
    expect(result).to.equal(false);
  });
});
