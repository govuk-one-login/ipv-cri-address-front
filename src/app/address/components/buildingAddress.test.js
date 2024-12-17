const { buildingAddressComponent } = require("./buildingAddress");
const {
  ukBuildingAddressEmptyValidator,
} = require("../validators/addressValidator");

describe("building address component", () => {
  let req;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    const setup = setupDefaultMocks();
    req = setup.req;
    req.translate = sandbox.stub();
  });

  afterEach(() => sandbox.restore());

  describe("getIndividualFieldErrorMessages", () => {
    it("should only return individual error message", () => {
      req.translate = (args) => args;
      req.form.errors = {
        addressHouseNumber: {
          key: "addressHouseNumber",
          type: "ukBuildingAddressEmptyValidator",
          url: "/address",
          args: {},
        },
        addressHouseName: {
          key: "addressHouseName",
          type: "alphaNumericWithSpecialChars",
          url: "/address",
          args: {},
        },
      };

      const result = buildingAddressComponent.getIndividualFieldErrorMessages(
        req.form.errors,
        "ukBuildingAddressEmptyValidator",
        req.translate
      );
      expect(result).to.deep.equal({
        addressHouseName: {
          text: "addressHouseName.validation.alphaNumericWithSpecialChars",
        },
      });
    });

    it("should remove input group vaildator and return empty", () => {
      req.translate = (args) => args;
      req.form.errors = {
        addressHouseNumber: {
          key: "addressHouseNumber",
          type: "ukBuildingAddressEmptyValidator",
          url: "/address",
          args: {},
        },
      };

      const result = buildingAddressComponent.getIndividualFieldErrorMessages(
        req.form.errors,
        "ukBuildingAddressEmptyValidator",
        req.translate
      );
      expect(result).to.deep.equal({});
    });

    it("should return empty", () => {
      req.translate = (args) => args;
      req.form.errors = {};

      const result = buildingAddressComponent.getIndividualFieldErrorMessages(
        req.form.errors,
        "ukBuildingAddressEmptyValidator",
        req.translate
      );
      expect(result).to.deep.equal({});
    });
  });

  describe("validateBuildingAddressEmpty", () => {
    it("should add validator to first field", () => {
      req.form.options.fields = {
        addressHouseNumber: { validate: [] },
        addressHouseName: { validate: [] },
      };

      const buildingAddress = {
        addressHouseNumber: "",
        addressHouseName: "",
      };

      buildingAddressComponent.validateBuildingAddressEmpty(
        req.form.options.fields,
        buildingAddress,
        ukBuildingAddressEmptyValidator
      );

      const expected = {
        addressHouseNumber: {
          validate: [{ fn: ukBuildingAddressEmptyValidator }],
        },
        addressHouseName: { validate: [] },
      };

      expect(req.form.options.fields).to.deep.equal(expected);
    });

    it("should not add validator to any field", () => {
      req.form.options.fields = {
        addressHouseNumber: { validate: [] },
        addressHouseName: { validate: [] },
      };

      const buildingAddress = {
        addressHouseNumber: "",
        addressHouseName: "1",
      };

      buildingAddressComponent.validateBuildingAddressEmpty(
        req.form.options.fields,
        buildingAddress,
        ukBuildingAddressEmptyValidator
      );

      const expected = {
        addressHouseNumber: { validate: [] },
        addressHouseName: { validate: [] },
      };

      expect(req.form.options.fields).to.deep.equal(expected);
    });

    it("returns empty object where there are no errors", () => {
      const result = buildingAddressComponent.getIndividualFieldErrorMessages(
        {},
        "validatorToSkip",
        req.translate
      );
      expect(result).to.deep.equal({});
    });
  });

  describe("hasValidationError", () => {
    it("should return true", () => {
      req.form.errors = {
        addressHouseNumber: {
          key: "addressHouseNumber",
          type: "ukBuildingAddressEmptyValidator",
          url: "/address",
          args: {},
        },
        addressHouseName: {
          key: "addressHouseName",
          type: "alphaNumericWithSpecialChars",
          url: "/address",
          args: {},
        },
      };

      const result = buildingAddressComponent.hasValidationError(
        "ukBuildingAddressEmptyValidator",
        req.form.errors
      );

      expect(result).to.equal(true);
    });

    it("should return false when no empty validator errors", () => {
      req.form.errors = {
        addressHouseName: {
          key: "addressHouseName",
          type: "alphaNumericWithSpecialChars",
          url: "/address",
          args: {},
        },
      };

      const result = buildingAddressComponent.hasValidationError(
        "ukBuildingAddressEmptyValidator",
        req.form.errors
      );

      expect(result).to.equal(false);
    });

    it("should return false when no errors", () => {
      const result = buildingAddressComponent.hasValidationError("", {});

      expect(result).to.equal(false);
    });

    it("should return false when errors falsey", () => {
      const result = buildingAddressComponent.hasValidationError("", null);

      expect(result).to.equal(false);
    });
  });
});
