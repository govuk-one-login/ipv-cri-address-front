const { confirmationValidation } = require("./confirmationValidator");

describe("Address confrimation validator", () => {
  describe("confirmationValidation", () => {
    it("should pass when previous address is added", () => {
      const isPreviousJourney = true;
      expect(confirmationValidation("", isPreviousJourney)).to.equal(true);
    });

    it("should pass when a value is passed and not in previous address journey", () => {
      const isPreviousJourney = false;
      expect(confirmationValidation("testInput", isPreviousJourney)).to.equal(
        true
      );
    });

    it("should fail when an empty string is passed, we're not in previous journey and additional addresses are needed - empty string", () => {
      const isPreviousJourney = false;
      const isAdditonalFieldRequired = true;
      expect(
        confirmationValidation("", isPreviousJourney, isAdditonalFieldRequired)
      ).to.equal(false);
    });

    it("should fail when null is passed, we're not in previous and additional addresses are needed - null string", () => {
      const isPreviousJourney = false;
      const isAdditonalFieldRequired = true;
      expect(
        confirmationValidation(
          null,
          isPreviousJourney,
          isAdditonalFieldRequired
        )
      ).to.equal(false);
    });

    it("should pass when a value is passed and addititonal info modal is needed", () => {
      const isPreviousJourney = false;
      const isAdditonalFieldRequired = true;
      expect(
        confirmationValidation(
          "testValue",
          isPreviousJourney,
          isAdditonalFieldRequired
        )
      ).to.equal(true);
    });
  });
});
