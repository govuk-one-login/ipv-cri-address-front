import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import FormWizard from "hmpo-form-wizard";
import { NonUKAddressController } from "./nonUKAddress.js";
import { buildingAddressComponent } from "../../components/buildingAddress.js";
import { buildingAddressEmptyValidator } from "../../validators/nonUKAddressValidator.js";
const { mockLogger } = vi.hoisted(() => ({
  mockLogger: {
    warn: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@govuk-one-login/di-ipv-cri-common-express", () => ({
  default: {
    bootstrap: {
      logger: {
        get: vi.fn(() => mockLogger),
      },
    },
  },
}));

const address = new NonUKAddressController({ route: "/test" });

describe("NonUKAddressController", () => {
  let req, res, next;

  beforeEach(() => {
    vi.spyOn(FormWizard.Controller.prototype, "getValues").mockImplementation(
      (_, __, callback) => callback(null, {})
    );

    req = {
      sessionModel: {
        get: vi.fn(),
        set: vi.fn(),
        unset: vi.fn(),
        toJSON: vi.fn(),
      },
      form: {
        options: {
          fields: {},
        },
        errors: {},
      },
      body: {},
      translate: vi.fn(),
    };
    res = {};
    next = vi.fn();
  });

  afterEach(() => vi.resetAllMocks());

  it("should be an instance of BaseController", () => {
    expect(address).to.be.an.instanceOf(FormWizard.Controller);
  });

  describe("getValues", () => {
    it("includes addressCountryName in values when country is set", () => {
      FormWizard.Controller.prototype.getValues = vi
        .fn()
        .mockImplementation((_, __, callback) => {
          callback(null, {});
        });

      req.form.errors = null;

      req.sessionModel.get.mockImplementation((key) => {
        if (key === "country") return "FR";
      });

      address.getValues(req, res, (err, values) => {
        expect(err).to.be.null;
        expect(values).to.deep.include({
          addressCountryName: "countries.FR",
        });
        expect(FormWizard.Controller.prototype.getValues).to.have.been
          .calledOnce;
      });
    });

    it("includes error messages in values when form errors are present", () => {
      req.form.errors = {
        nonUKAddressApartmentNumber: {
          key: "nonUKAddressApartmentNumber",
          type: "required",
        },
      };

      req.translate.mockImplementation((key) => {
        if (key === "nonUKAddressApartmentNumber.validation.required")
          return "Apartment number is required";
      });

      address.getValues(req, res, (err, values) => {
        expect(err).to.be.null;
        expect(values).to.deep.include({
          errors: {
            buildingAddressEmptyErrorMessage: false,
            nonUKAddressApartmentNumber: {
              text: "Apartment number is required",
            },
          },
        });
      });
    });

    it("calls callback with error when buildAddress throws", async () => {
      const error = new Error("Boom");

      vi.spyOn(address, "buildAddress").mockImplementation(() => {
        throw error;
      });

      const callback = vi.fn();

      await address.saveValues(req, res, callback);

      expect(callback).to.have.been.calledOnceWith(error);
    });

    it("includes buildingAddressEmptyErrorMessage in errors", () => {
      req.form.errors = {
        nonUKAddressApartmentNumber: {
          key: "nonUKAddressApartmentNumber",
          type: "buildingAddressEmptyValidator",
        },
      };

      req.translate.mockImplementation((key) => {
        if (key === "validation.buildingAddressEmptyValidator")
          return "Apartment number is required";
      });

      address.getValues(req, res, (err, values) => {
        expect(err).to.be.null;
        expect(values).to.deep.include({
          errors: {
            buildingAddressEmptyErrorMessage: {
              text: "Apartment number is required",
              visuallyHiddenText: "error",
            },
          },
        });
      });
    });
  });

  describe("validateFields", () => {
    it("defaults validation to the first field when all building address fields are empty", () => {
      let validateBuildingAddressEmptySpy = vi.spyOn(
        buildingAddressComponent,
        "validateBuildingAddressEmpty"
      );
      let defaultToFirstFieldSpy = vi.spyOn(
        buildingAddressComponent,
        "defaultToFirstField"
      );

      req.body = {
        nonUKAddressApartmentNumber: "",
        nonUKAddressBuildingNumber: "",
        nonUKAddressBuildingName: "",
      };

      req.form.options.fields = {
        nonUKAddressApartmentNumber: { validate: [] },
      };

      const buildingAddress = {
        nonUKAddressApartmentNumber: "",
        nonUKAddressBuildingNumber: "",
        nonUKAddressBuildingName: "",
      };

      address.validateFields(req, res, next);

      expect(validateBuildingAddressEmptySpy).to.have.been.calledOnceWith(
        req.form.options.fields,
        buildingAddress,
        buildingAddressEmptyValidator
      );
      expect(defaultToFirstFieldSpy).to.have.been.calledOnce;
      expect(next).to.have.been.calledOnce;
      expect(next).to.have.been.calledOnce;

      validateBuildingAddressEmptySpy.mockRestore();
      defaultToFirstFieldSpy.mockRestore();
    });

    it("does not default to the first field when at least one building address field is provided", () => {
      let validateBuildingAddressEmptySpy = vi.spyOn(
        buildingAddressComponent,
        "validateBuildingAddressEmpty"
      );
      let defaultToFirstFieldSpy = vi.spyOn(
        buildingAddressComponent,
        "defaultToFirstField"
      );

      req.body = {
        nonUKAddressApartmentNumber: "2",
        nonUKAddressBuildingNumber: "",
        nonUKAddressBuildingName: "",
      };

      req.form.options.fields = {
        nonUKAddressApartmentNumber: { validate: [] },
      };

      const buildingAddress = {
        nonUKAddressApartmentNumber: "2",
        nonUKAddressBuildingNumber: "",
        nonUKAddressBuildingName: "",
      };

      address.validateFields(req, res, next);

      expect(validateBuildingAddressEmptySpy).to.have.been.calledOnceWith(
        req.form.options.fields,
        buildingAddress,
        buildingAddressEmptyValidator
      );
      expect(defaultToFirstFieldSpy).not.to.have.been.calledOnce;
      expect(next).to.have.been.calledOnce;

      validateBuildingAddressEmptySpy.mockRestore();
      defaultToFirstFieldSpy.mockRestore();
    });
  });

  describe("saveValues", () => {
    it("saves address in the session model", async () => {
      const addressData = {
        nonUKAddressApartmentNumber: "Apt 1",
        nonUKAddressBuildingNumber: "123",
        nonUKAddressBuildingName: "Example House",
        nonUKAddressStreetName: "Main Street",
        nonUKAddressLocality: "Example Town",
        nonUKAddressPostalCode: "12345",
        nonUKAddressRegion: "Example Region",
        nonUKAddressYearFrom: "2020",
      };
      const addressCountry = "FR";

      req.body = addressData;

      req.translate.mockImplementation((key) => {
        if (key === "country") return addressCountry;
      });

      vi.spyOn(address, "buildAddress").mockReturnValue({
        ...addressData,
        addressCountry,
      });

      const callback = vi.fn();
      await address.saveValues(req, res, callback);

      expect(req.sessionModel.set).to.have.been.calledWith("address", {
        ...addressData,
        addressCountry,
      });
      expect(callback).to.have.been.calledOnce;
    });

    it("saves address and trims whitespace only fields", async () => {
      const addressData = {
        nonUKAddressApartmentNumber: "    ",
        nonUKAddressBuildingNumber: "    ",
        nonUKAddressBuildingName: "    ",
        nonUKAddressStreetName: "    ",
        nonUKAddressLocality: "    ",
        nonUKAddressPostalCode: "    ",
        nonUKAddressRegion: "    ",
        nonUKAddressYearFrom: "2020",
      };
      const addressCountry = "FR";

      const trimmedAddress = {
        addressRegion: "",
        addressLocality: "",
        streetName: "",
        postalCode: "",
        buildingNumber: "",
        buildingName: "",
        subBuildingName: "",
        validFrom: "2020-01-01",
      };

      req.body = addressData;
      req.sessionModel.get.mockImplementation((key) => {
        if (key === "country") return addressCountry;
      });

      const callback = vi.fn();
      await address.saveValues(req, res, callback);

      expect(req.sessionModel.set).to.have.been.calledWith("address", {
        ...trimmedAddress,
        addressCountry,
      });
      expect(callback).to.have.been.calledOnce;
    });
  });

  describe("buildAddress", () => {
    it("builds the address object correctly", () => {
      const addressCountry = "FR";

      const buildAddress = address.buildAddress(
        {
          nonUKAddressApartmentNumber: "Apt 1",
          nonUKAddressBuildingNumber: "12",
          nonUKAddressBuildingName: "Building Name",
          nonUKAddressStreetName: "Street",
          nonUKAddressLocality: "Locality",
          nonUKAddressPostalCode: "Postal Code",
          nonUKAddressRegion: "Region",
          nonUKAddressYearFrom: "2020",
        },
        addressCountry
      );

      expect(buildAddress).to.deep.equal({
        addressRegion: "Region",
        addressLocality: "Locality",
        streetName: "Street",
        postalCode: "Postal Code",
        buildingNumber: "12",
        buildingName: "Building Name",
        subBuildingName: "Apt 1",
        validFrom: "2020-01-01",
        addressCountry,
      });
    });
    describe("when buildAddress throws", () => {
      beforeEach(async () => {
        const error = new Error("build failed");

        error.address = {
          postalCode: "75008",
          streetName: "Avenue des Champs-Élysées",
          buildingNumber: "123",
        };

        vi.spyOn(address, "buildAddress").mockImplementation(() => {
          throw error;
        });

        await address.saveValues(req, res, next);
      });

      it("should call callback with the error", () => {
        expect(next).to.have.been.calledOnce;
      });

      it("should log only the error message", () => {
        expect(mockLogger.error).toHaveBeenCalledWith(
          {
            component: "NonUKAddressController",
            message: "build failed",
          },
          "Failed to save non-uk address"
        );
      });

      it("should not log address data", () => {
        const loggedMetadata = mockLogger.error.mock.calls[0][0];

        expect(JSON.stringify(loggedMetadata)).not.toContain("75008");
        expect(JSON.stringify(loggedMetadata)).not.toContain(
          "Avenue des Champs-Élysées"
        );
        expect(JSON.stringify(loggedMetadata)).not.toContain("123");
      });
    });
  });
});
