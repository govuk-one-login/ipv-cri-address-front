import { describe, it, beforeEach, afterEach, expect, vi } from "vitest";
import { createDefaultReqResNext } from "../../../../../test/utils/helpers.js";
import FormWizard from "hmpo-form-wizard";
import { addressFactory } from "../../../../../test/utils/addressFactory.js";
import { buildingAddressComponent } from "../../components/buildingAddress.js";
import { ukBuildingAddressEmptyValidator } from "../../validators/addressValidator.js";
import { AddressController } from "./manual.js";

describe("address controller", () => {
  const address = new AddressController({ route: "/test" });

  let req;
  let res;
  let next;

  beforeEach(() => {
    const setup = createDefaultReqResNext();
    req = setup.req;
    req.translate = vi.fn();
    res = setup.res;
    next = setup.next;
  });

  afterEach(() => vi.resetAllMocks());

  it("should be an instance of BaseController", () => {
    expect(address).to.be.an.instanceOf(FormWizard.Controller);
  });

  describe("getValues", () => {
    it("should prepopulate postcode with input address when no address has been chosen", () => {
      const generatedAddress = addressFactory(1);
      req.sessionModel.set("addressPostcode", generatedAddress[0].postalCode);

      address.getValues(req, res, next);

      expect(next).to.have.been.calledOnce;
      expect(next).to.have.been.calledWith(null, {
        addressPostcode: generatedAddress[0].postalCode,
        addressFormTitle: "pages.address-form.title",
      });
    });

    it("should prepopulate with the chosen address when part of the standard route", () => {
      const generatedAddress = addressFactory(1);
      req.sessionModel.set("addressPostcode", generatedAddress[0].postalCode);

      req.sessionModel.set("address", generatedAddress[0]);

      address.getValues(req, res, next);
      expect(next).to.have.been.calledOnce;
      expect(next).to.have.been.calledWith(
        null,
        expect.objectContaining({
          addressPostcode: generatedAddress[0].postalCode,
          addressHouseNumber: generatedAddress[0].buildingNumber,
          addressStreetName: generatedAddress[0].streetName,
          addressLocality: generatedAddress[0].addressLocality,
          addressYearFrom: Number(generatedAddress[0].validFrom),
          addressHouseName: generatedAddress[0].buildingName,
        })
      );
    });

    it("sets field and group level errors", () => {
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

      address.getValues(req, res, next);

      expect(next).to.have.been.calledWith(null, {
        addressPostcode: undefined,
        addressFormTitle: "pages.address-form.title",
        errors: {
          addressHouseName: {
            text: "addressHouseName.validation.alphaNumericWithSpecialChars",
          },
          ukBuildingAddressEmptyValidator: {
            text: "validation.ukBuildingAddressEmptyValidator",
            visuallyHiddenText: "error",
          },
        },
      });
    });

    it("sets building address empty errors if there are any", () => {
      req.translate = (args) => args;
      req.form.errors = {
        addressHouseNumber: {
          key: "addressHouseNumber",
          type: "ukBuildingAddressEmptyValidator",
          url: "/address",
          args: {},
        },
      };

      address.getValues(req, res, next);

      expect(next).to.have.been.calledWith(null, {
        addressPostcode: undefined,
        addressFormTitle: "pages.address-form.title",
        errors: {
          ukBuildingAddressEmptyValidator: {
            text: "validation.ukBuildingAddressEmptyValidator",
            visuallyHiddenText: "error",
          },
        },
      });
    });

    describe("viewing /address", () => {
      it("should populate addressFormTitle with pages.address-form.title", () => {
        address.getValues(req, res, next);

        expect(next).to.have.been.calledOnce;
        expect(next).to.have.been.calledWith(null, {
          addressPostcode: undefined,
          addressFormTitle: "pages.address-form.title",
        });

        req.originalUrl = "/address";
        address.getValues(req, res, next);

        expect(next).to.have.been.calledWith(null, {
          addressPostcode: undefined,
          addressFormTitle: "pages.address-form.title",
        });
      });
    });

    describe("viewing /previous/address", () => {
      it("should populate addressFormTitle with pages.address-form-previous.title", () => {
        req.originalUrl = "/previous/address";

        address.getValues(req, res, next);

        expect(next).to.have.been.calledOnce;
        expect(next).to.have.been.calledWith(null, {
          addressPostcode: undefined,
          addressFormTitle: "pages.address-form-previous.title",
        });
      });
    });

    describe("viewing /address/edit?edit=true", () => {
      it("should populate addressFormTitle with pages.address-form.check-details.title", () => {
        req.originalUrl = "/address/edit?edit=true";

        address.getValues(req, res, next);

        expect(next).to.have.been.calledOnce;
        expect(next).to.have.been.calledWith(null, {
          addressPostcode: undefined,
          addressFormTitle: "pages.address-form.check-details.title",
        });
      });
    });

    describe("viewing /previous/address/edit?edit=true", () => {
      it("should populate addressFormTitle with pages.address-form-previous.check-details.title", () => {
        req.originalUrl = "/previous/address/edit?edit=true";

        address.getValues(req, res, next);

        expect(next).to.have.been.calledOnce;
        expect(next).to.have.been.calledWith(null, {
          addressPostcode: undefined,
          addressFormTitle: "pages.address-form-previous.check-details.title",
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
        addressHouseNumber: "",
        addressHouseName: "",
      };

      req.form.options.fields = {
        addressHouseNumber: { validate: [] },
      };

      req.translate.mockImplementation((key) => {
        if (key === "validation.houseNameOrHouseNumber")
          return "Enter a house number or house name.";
      });

      const buildingAddress = {
        addressHouseNumber: "",
        addressHouseName: "",
      };

      address.validateFields(req, res, next);

      expect(validateBuildingAddressEmptySpy).to.have.been.calledOnceWith(
        req.form.options.fields,
        buildingAddress,
        ukBuildingAddressEmptyValidator
      );
      expect(defaultToFirstFieldSpy).to.have.been.calledOnce;
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
        addressHouseNumber: "123",
        addressHouseName: "",
      };

      req.form.options.fields = {
        addressHouseNumber: { validate: [] },
      };

      const buildingAddress = {
        addressHouseNumber: "123",
        addressHouseName: "",
      };

      address.validateFields(req, res, next);

      expect(validateBuildingAddressEmptySpy).to.have.been.calledOnceWith(
        req.form.options.fields,
        buildingAddress,
        ukBuildingAddressEmptyValidator
      );
      expect(defaultToFirstFieldSpy).not.to.have.been.calledOnce;
      expect(next).to.have.been.calledOnce;

      validateBuildingAddressEmptySpy.mockRestore();
      defaultToFirstFieldSpy.mockRestore();
    });
  });

  describe("saveValues", () => {
    it("should save the address into the session - flat example", async () => {
      const addressToSave = {
        addressFlatNumber: "10a",
        addressHouseName: "My buildng name",
        addressStreetName: "street road",
        addressLocality: "small town",
        addressYearFrom: "2022",
      };

      req.body = addressToSave;

      await address.saveValues(req, res, next);

      const savedAddress = req.sessionModel.get("address");
      expect(next).to.have.been.calledOnce;
      expect(savedAddress.subBuildingName).to.equal(
        addressToSave.addressFlatNumber
      );
      expect(savedAddress.buildingNumber).to.equal(
        addressToSave.addressHouseNumber
      );
      expect(savedAddress.streetName).to.equal(addressToSave.addressStreetName);
      expect(savedAddress.addressLocality).to.equal(
        addressToSave.addressLocality
      );
      expect(savedAddress.buildingName).to.equal(
        addressToSave.addressHouseName
      );
      expect(savedAddress.addressCountry).to.equal("GB");
      expect(addressToSave.addressCountry).to.be.undefined;
    });

    it("should save the address into the session - house example", async () => {
      const addressToSave = {
        addressHouseNumber: "10a",
        addressStreetName: "street road",
        addressLocality: "small town",
        addressYearFrom: "2022",
      };

      req.body = addressToSave;

      await address.saveValues(req, res, next);

      const savedAddress = req.sessionModel.get("address");
      expect(next).to.have.been.calledOnce;
      expect(savedAddress.buildingNumber).to.equal(
        addressToSave.addressHouseNumber
      );
      expect(savedAddress.streetName).to.equal(addressToSave.addressStreetName);
      expect(savedAddress.addressLocality).to.equal(
        addressToSave.addressLocality
      );
      expect(savedAddress.addressCountry).to.equal("GB");
      expect(addressToSave.addressCountry).to.be.undefined;
    });

    it("should overwrite the current address when current address already exists", async () => {
      const addressToSave = {
        addressFlatNumber: "1a",
        addressHouseName: "My building",
        addressStreetName: "avenue",
        addressLocality: "large town",
        addressYearFrom: "2022",
      };

      const existingAddresses = addressFactory(1);
      req.sessionModel.set("address", existingAddresses[0]);

      req.body = addressToSave;

      await address.saveValues(req, res, next);

      const savedAddresses = req.sessionModel.get("address");

      expect(next).to.have.been.calledOnce;
      expect(savedAddresses.buildingName).to.equal(
        addressToSave.addressHouseName
      );
      expect(savedAddresses.subBuildingName).to.equal(
        addressToSave.addressFlatNumber
      );
      expect(savedAddresses.buildingNumber).to.equal(
        addressToSave.addressHouseNumber
      );
      expect(savedAddresses.addressLocality).to.equal(
        addressToSave.addressLocality
      );
      expect(savedAddresses.addressStreetName).to.equal(
        addressToSave.streetName
      );
      expect(savedAddresses.addressCountry).to.equal("GB");
      expect(addressToSave.addressCountry).to.be.undefined;
    });

    it("should delete the UPRN when overwriting the saved address", async () => {
      const addressToSave = {
        addressFlatNumber: "1a",
        addressHouseName: "My building",
        addressStreetName: "avenue",
        addressLocality: "large town",
        addressYearFrom: "2022",
      };

      const existingAddresses = addressFactory(2);
      existingAddresses[1].subBuildingName = "SubBuilding 1";
      existingAddresses[1].uprn = "123abc";
      req.sessionModel.set("address", existingAddresses[1]);
      req.body = addressToSave;

      await address.saveValues(req, res, next);

      const savedAddresses = req.sessionModel.get("address");
      expect(next).to.have.been.calledOnce;

      expect(savedAddresses.uprn).to.be.undefined;
    });

    it("should trim field if it is whitespace only", async () => {
      const addressToSave = {
        addressHouseNumber: "   ",
        addressFlatNumber: "   ",
        addressHouseName: "   ",
        addressStreetName: "   ",
        addressLocality: "   ",
        addressYearFrom: "2022",
      };

      req.body = addressToSave;

      await address.saveValues(req, res, next);

      const savedAddress = req.sessionModel.get("address");
      expect(next).to.have.been.calledOnce;
      expect(savedAddress.subBuildingName).to.equal("");
      expect(savedAddress.buildingNumber).to.equal("");
      expect(savedAddress.streetName).to.equal("");
      expect(savedAddress.addressLocality).to.equal("");
      expect(savedAddress.buildingName).to.equal("");
      expect(savedAddress.addressCountry).to.equal("GB");
      expect(addressToSave.addressCountry).to.be.undefined;
    });

    it("should not trim field if it is has chars", async () => {
      const addressToSave = {
        addressFlatNumber: " a  ",
        addressHouseName: " b  ",
        addressStreetName: " c  ",
        addressLocality: " d  ",
        addressYearFrom: "2022",
      };

      req.body = addressToSave;

      await address.saveValues(req, res, next);

      const savedAddress = req.sessionModel.get("address");
      expect(next).to.have.been.calledOnce;
      expect(savedAddress.buildingName).to.equal(
        addressToSave.addressHouseName
      );
      expect(savedAddress.subBuildingName).to.equal(
        addressToSave.addressFlatNumber
      );
      expect(savedAddress.buildingNumber).to.equal(
        addressToSave.addressHouseNumber
      );
      expect(savedAddress.addressLocality).to.equal(
        addressToSave.addressLocality
      );
      expect(savedAddress.addressStreetName).to.equal(addressToSave.streetName);
      expect(savedAddress.addressCountry).to.equal("GB");
      expect(addressToSave.addressCountry).to.be.undefined;
    });
  });
});
