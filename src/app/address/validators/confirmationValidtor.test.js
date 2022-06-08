const { confirmationValidation } = require("./confirmationValidator");

describe("Address confrimation validator", () => {
  describe("confirmationValidation", () => {
    it("should pass when previous address has been added", () => {
      const isPreviousJourney = true;
      expect(confirmationValidation("testInput", isPreviousJourney)).to.equal(
        true
      );
    });

    it("should pass when value is passed and not in previous address journey", () => {
      const isPreviousJourney = false;
      expect(confirmationValidation("testInput", isPreviousJourney)).to.equal(
        true
      );
    });

    it("should fail when empty string value is passed and not in previous address journey - empty string", () => {
      const isPreviousJourney = false;
      expect(confirmationValidation("", isPreviousJourney)).to.equal(false);
    });

    it("should fail when null value is passed and not in previous address journey", () => {
      const isPreviousJourney = false;
      expect(confirmationValidation(null, isPreviousJourney)).to.equal(false);
    });
  });
});
