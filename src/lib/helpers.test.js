describe("helpers", () => {
  const { yearFrom, getCountry } = require("./helpers");

  context("yearFrom", () => {
    it("returns ISO string for a valid year", () => {
      expect(yearFrom("2024")).to.equal("2024-01-01");
    });

    it("returns null for null input", () => {
      expect(yearFrom(null)).to.be.null;
    });

    it("returns null for empty string input", () => {
      expect(yearFrom("")).to.be.null;
    });

    it("handles invalid year gracefully", () => {
      expect(yearFrom("abcd")).to.be.null;
    });
  });

  context("getCountry", () => {
    it("returns the correct country object for a valid country code", () => {
      expect(getCountry("US")).to.deep.equal({
        value: "US",
        key: "countries.US",
      });
    });

    it("returns undefined for an invalid country code", () => {
      expect(getCountry("INVALID_CODE")).to.be.undefined;
    });

    it("returns undefined for a null country code", () => {
      expect(getCountry(null)).to.be.undefined;
    });

    it("returns undefined for an empty string country code", () => {
      expect(getCountry("")).to.be.undefined;
    });
  });
});
