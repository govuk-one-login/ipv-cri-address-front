const {
  alphaNumericWithSpecialChars,
  isPreviousYear,
  validateHouseNumberAndName,
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

const validYears = [
  "2021",
  "2010",
  "1970",
  "0000",
  String(today.getFullYear()),
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

    it("should pass with valid dates", () => {
      const results = invalidFutureYears.map(isPreviousYear);
      results.forEach((val) => expect(val).to.equal(false));
    });
  });

  describe("validateHouseNumberAndName", () => {
    it("should pass when both values exist", () => {
      const results = validateHouseNumberAndName("number", "name");
      expect(results).to.equal(true);
    });

    it("should fail when the both values dont exist", () => {
      const results = validateHouseNumberAndName("", "");
      expect(results).to.equal(false);
    });

    it("shoudl pass when one value exists", () => {
      const results = validateHouseNumberAndName("", "name");
      expect(results).to.equal(true);
    });
  });
});
