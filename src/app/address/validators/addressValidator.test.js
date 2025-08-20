const {
  alphaNumericWithSpecialChars,
  isPreviousYear,
  isLessThanOneHundredYearsAgo,
  ukBuildingAddressEmptyValidator,
} = require("./addressValidator");

const today = new Date();
const nextYear = String(today.getFullYear() + 1);
const validInput = [
  "1a",
  "White Chapel",
  "Aldgate High Street",
  "London",
  "ST. JOHN'S ROAD",
];

const currentYear = today.getFullYear();

const validYears = [
  currentYear - 3,
  currentYear - 15,
  currentYear - 50,
  currentYear - 99,
  currentYear,
];

const invalidInput = ["()%&^5$£@!|", "BadFlatNumber%"];
const invalidFutureYears = ["2030", nextYear];

describe("Address validator", () => {
  describe("alphaNumericWithSpecialChars", () => {
    it("should return true when empty string is passed", () => {
      const result = alphaNumericWithSpecialChars("");
      expect(result).to.equal(true);
    });

    it("should pass when valid strings are passed", () => {
      const results = validInput.map(alphaNumericWithSpecialChars);
      results.forEach((val) => expect(val).to.equal(true));
    });

    it("should fail when invalid strings are passed", () => {
      const results = invalidInput.map(alphaNumericWithSpecialChars);
      results.forEach((val) => expect(val).to.equal(false));
    });
  });

  describe("isPreviousDate", () => {
    it("should pass with valid dates", () => {
      const results = validYears.map(isPreviousYear);
      results.forEach((val) => expect(val).to.equal(true));
    });

    it("should fail with invalid dates", () => {
      const results = invalidFutureYears.map(isPreviousYear);
      results.forEach((val) => expect(val).to.equal(false));
    });
  });

  describe("isLessThanOneHundredYearsAgo", () => {
    it("should pass with valid year", () => {
      const results = validYears.map(isLessThanOneHundredYearsAgo);
      results.forEach((val) => expect(val).to.equal(true));
    });

    it("should fail with date > 100 years", () => {
      const invalidPastYears = [currentYear - 101, currentYear - 1000, 0];
      const results = invalidPastYears.map(isLessThanOneHundredYearsAgo);
      results.forEach((val) => expect(val).to.equal(false));
    });

    it("should fail with date 0000", () => {
      expect(isLessThanOneHundredYearsAgo("0000")).to.equal(false);
    });
  });

  describe("ukBuildingAddressEmptyValidator", () => {
    it("should return houseNumber when both houseNumber and houseName exist", () => {
      const results = ukBuildingAddressEmptyValidator("2", "houseName");
      expect(results).to.equal("2");
    });

    it("should return empty string when both houseNumber and houseName are empty", () => {
      const results = ukBuildingAddressEmptyValidator("", "");
      expect(results).to.equal("");
    });

    it("should return houseName when houseNumber is empty and houseName exists", () => {
      const results = ukBuildingAddressEmptyValidator("", "houseName");
      expect(results).to.equal("houseName");
    });

    it("should return houseNumber when houseName is empty and houseNumber exists", () => {
      const results = ukBuildingAddressEmptyValidator("2", "");
      expect(results).to.equal("2");
    });

    it("should return empty when houseNumber and houseName are null", () => {
      const results = ukBuildingAddressEmptyValidator(null, null);
      expect(results).to.equal("");
    });

    it("should return houseNumber when houseName is null", () => {
      const results = ukBuildingAddressEmptyValidator("1", null);
      expect(results).to.equal("1");
    });

    it("should return houseName when houseNumber is null", () => {
      const results = ukBuildingAddressEmptyValidator(null, "2");
      expect(results).to.equal("2");
    });
  });
});
