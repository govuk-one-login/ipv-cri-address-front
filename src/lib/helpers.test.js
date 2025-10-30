describe("helpers", () => {
  const {
    yearFrom,
    getCountry,
    trimOnlyWhitespaceStrings,
  } = require("./helpers");

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

  context("trimOnlyWhitespaceStrings", () => {
    it("replaces whitespace only strings with empty strings", () => {
      const input = { a: "   ", b: "\n\t " };
      const result = trimOnlyWhitespaceStrings(input);
      expect(result).to.deep.equal({ a: "", b: "" });
    });

    it("leaves non-whitespace only strings unchanged", () => {
      const input = { a: " hello ", b: "world" };
      const result = trimOnlyWhitespaceStrings(input);
      expect(result).to.deep.equal(input);
    });

    it("leaves none string values unchanged", () => {
      const input = {
        a: 42,
        b: null,
        c: undefined,
        d: true,
        e: { nested: " " },
      };
      const result = trimOnlyWhitespaceStrings(input);
      expect(result).to.deep.equal(input);
    });

    it("keeps empty strings as empty strings", () => {
      const input = { a: "" };
      const result = trimOnlyWhitespaceStrings(input);
      expect(result).to.deep.equal({ a: "" });
    });

    it("handles empty object", function () {
      const result = trimOnlyWhitespaceStrings({});
      expect(result).to.deep.equal({});
    });
  });
});
