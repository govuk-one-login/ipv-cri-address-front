const { expect } = require("chai");
const BaseController = require("hmpo-form-wizard").Controller;
const NonUKAddressController = require("./nonUKAddress");
const address = new NonUKAddressController({ route: "/test" });

describe("NonUKAddressController", () => {
  let req, res, next, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    sandbox
      .stub(BaseController.prototype, "getValues")
      .callsFake((_, __, callback) => callback(null, {}));

    req = {
      sessionModel: {
        get: sandbox.stub(),
        set: sandbox.stub(),
        unset: sandbox.stub(),
        toJSON: sandbox.stub(),
      },
      form: {
        options: {
          fields: {},
        },
        errors: {},
      },
      body: {},
      translate: sandbox.stub(),
    };
    res = {};
    next = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should be an instance of BaseController", () => {
    expect(address).to.be.an.instanceOf(BaseController);
  });

  describe("getValues", () => {
    it("includes addressCountryName in values when country is set", (done) => {
      BaseController.prototype.getValues.callsFake((_, __, callback) => {
        callback(null, {});
      });

      req.sessionModel.get.withArgs("country").returns("FR");

      address.getValues(req, res, (err, values) => {
        expect(err).to.be.null;
        expect(values).to.deep.include({
          addressCountryName: "countries.FR",
        });
        expect(BaseController.prototype.getValues).to.have.been.calledOnce;
        done();
      });
    });

    it("includes error messages in values when form errors are present", (done) => {
      req.form.errors = {
        nonUKAddressApartmentNumber: {
          key: "nonUKAddressApartmentNumber",
          type: "required",
        },
      };

      req.translate
        .withArgs("nonUKAddressApartmentNumber.validation.required")
        .returns("Apartment number is required");

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
        done();
      });
    });
  });

  describe("validateFields", () => {
    it("defaults validation to the first field when all building address fields are empty", () => {
      req.body = {
        nonUKAddressApartmentNumber: "",
        nonUKAddressBuildingNumber: "",
        nonUKAddressBuildingName: "",
      };

      req.form.options.fields = {
        nonUKAddressApartmentNumber: { validate: [] },
      };

      sandbox.stub(address, "defaultToFirstField");

      address.validateFields(req, res, next);

      expect(address.defaultToFirstField).to.have.been.calledOnceWith(
        req.form.options.fields,
        "nonUKAddressApartmentNumber"
      );
      expect(next).to.have.been.calledOnce;
    });

    it("does not default to the first field when at least one building address field is provided", () => {
      req.body = {
        nonUKAddressApartmentNumber: "2",
        nonUKAddressBuildingNumber: "",
        nonUKAddressBuildingName: "",
      };

      req.form.options.fields = {
        nonUKAddressApartmentNumber: { validate: [] },
      };

      sandbox.stub(address, "defaultToFirstField");

      address.validateFields(req, res, next);

      expect(address.defaultToFirstField).not.to.have.been.calledOnceWith(
        req.form.options.fields,
        "nonUKAddressApartmentNumber"
      );
      expect(next).to.have.been.calledOnce;
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
      req.sessionModel.get.withArgs("country").returns(addressCountry);

      sandbox.stub(address, "buildAddress").returns({
        ...addressData,
        addressCountry,
      });

      const callback = sandbox.stub();
      await address.saveValues(req, res, callback);

      expect(req.sessionModel.set).to.have.been.calledWith("address", {
        ...addressData,
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
  });
});
