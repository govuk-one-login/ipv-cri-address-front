const BaseController = require("hmpo-form-wizard").Controller;
const { expect } = require("chai");
const addressFactory = require("../../../../../test/utils/addressFactory");
const AddressController = require("./manual");

describe("address controller", () => {
  const address = new AddressController({ route: "/test" });

  let req;
  let res;
  let next;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    const setup = setupDefaultMocks();
    req = setup.req;
    res = setup.res;
    next = setup.next;
  });

  afterEach(() => sandbox.restore());

  it("should be an instance of BaseController", () => {
    expect(address).to.be.an.instanceOf(BaseController);
  });

  describe("getValues", () => {
    it("should prepopulate postcode with input address when no address has been chosen", () => {
      const generatedAddress = addressFactory(1);
      req.sessionModel.set("addressPostcode", generatedAddress[0].postalCode);

      address.getValues(req, res, next);

      expect(next).to.have.been.calledOnce;
      expect(next).to.have.been.calledWith(null, {
        addressPostcode: generatedAddress[0].postalCode,
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
        sinon.match({
          addressPostcode: generatedAddress[0].postalCode,
          addressHouseNumber: generatedAddress[0].buildingNumber,
          addressStreetName: generatedAddress[0].streetName,
          addressLocality: generatedAddress[0].addressLocality,
          addressYearFrom: Number(generatedAddress[0].validFrom),
          addressHouseName: generatedAddress[0].buildingName,
        })
      );
    });
  });

  describe("saveValues", () => {
    it("should save the address into the session - flat example", async () => {
      const addressToSave = {
        addressFlatNumber: "10a",
        addressHouseName: "My buildng name",
        addressStreetName: "street road",
        addressLocality: "small town",
        addressCountry: "GB",
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
      expect(savedAddress.addressCountry).to.equal(
        addressToSave.addressCountry
      );
    });

    it("should save the address into the session - house example", async () => {
      const addressToSave = {
        addressHouseNumber: "10a",
        addressStreetName: "street road",
        addressLocality: "small town",
        addressCountry: "GB",
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
      expect(savedAddress.addressCountry).to.equal(
        addressToSave.addressCountry
      );
    });

    it("should overwrite the current address when current address already exists", async () => {
      const addressToSave = {
        addressFlatNumber: "1a",
        addressHouseName: "My building",
        addressStreetName: "avenue",
        addressLocality: "large town",
        addressCountry: "GB",
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
      expect(savedAddresses.addressCountry).to.equal(
        addressToSave.addressCountry
      );
    });

    it("should delete the UPRN when overwriting the saved address", async () => {
      const addressToSave = {
        addressFlatNumber: "1a",
        addressHouseName: "My building",
        addressStreetName: "avenue",
        addressLocality: "large town",
        addressCountry: "GB",
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
  });
});
