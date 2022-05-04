const {
  postcodeLength,
  alphaNumeric,
  missingAlphaOrNumeric,
  isUkPostcode,
} = require("./postcodeValidator");

const validPostcodes = ["E18QS", "PA296YP"];
const invalidPostcodeLength = ["1", "88888888", "4444", ""];
const invalidAlphaOnly = ["abcde", "VXYZ", "AbCdEf"];
const invalidIntOnly = ["11111", "123456", "000000"];
const invalidSpecialChars = ["******", "E18Q%", "|/~_+!@"];
const nonUkPostcodes = ["M1E1P5", "V9A2R3", "1A1B2B"]; // Canadian include alphanumeric data.

describe("Postcode validator", () => {
  describe("postcodeLength", () => {
    it("should pass with valid length postcodes", () => {
      const results = validPostcodes.map(postcodeLength);
      results.forEach((val) => expect(val).to.equal(true));
    });

    it("should fail when invalid length postcodes", () => {
      const results = invalidPostcodeLength.map(postcodeLength);
      results.forEach((val) => {
        expect(val).to.equal(false);
      });
    });
  });

  describe("alphaNumeric", () => {
    it("should pass with valid postcodes", () => {
      const results = validPostcodes.map(alphaNumeric);
      results.forEach((val) => expect(val).to.equal(true));
    });

    it("should fail with invalid postcodes", () => {
      const results = invalidSpecialChars.map(alphaNumeric);
      results.forEach((val) => expect(val).to.equal(false));
    });
  });

  describe("missingAlphaOrNumeric", () => {
    it("should pass with valid postcodes", () => {
      const results = validPostcodes.map(missingAlphaOrNumeric);
      results.forEach((val) => expect(val).to.equal(true));
    });

    it("should fail with only alpha characters", () => {
      const results = invalidAlphaOnly.map(missingAlphaOrNumeric);
      results.forEach((val) => expect(val).to.equal(false));
    });

    it("should fail with only numeric characters", () => {
      const results = invalidIntOnly.map(missingAlphaOrNumeric);
      results.forEach((val) => expect(val).to.equal(false));
    });
  });

  describe("isUkPostcode", () => {
    it("should pass with valid postcodes", () => {
      const results = validPostcodes.map(isUkPostcode);
      results.forEach((val) => expect(val).to.equal(true));
    });

    it("should fail with invalid postcodes", () => {
      const results = nonUkPostcodes.map(isUkPostcode);
      results.forEach((val) => expect(val).to.equal(false));
    });
  });
});
