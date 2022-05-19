const BaseController = require("hmpo-form-wizard").Controller;
const { expect } = require("chai");
const addressFactory = require("../../../../test/utils/addressFactory");
const AddressController = require("./address");

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
    it("should only prepopulate postalcode if no address has been chosen", () => {
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

      req.sessionModel.set("chosenAddress", generatedAddress[0]);

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

    it("should prepopulate with the previous address when in editing previous address route", () => {
      const generatedAddress = addressFactory(2);
      req.originalUrl = "/previous/address/edit";
      req.sessionModel.set("addresses", generatedAddress);
      address.getValues(req, res, next);
      expect(next).to.have.been.calledOnce;
      expect(next).to.have.been.calledWith(
        null,
        sinon.match({
          addressPostcode: generatedAddress[1].postalCode,
          addressHouseNumber: generatedAddress[1].buildingNumber,
          addressHouseName: generatedAddress[1].buildingName,
          addressStreetName: generatedAddress[1].streetName,
          addressLocality: generatedAddress[1].addressLocality,
          addressYearFrom: Number(generatedAddress[1].validFrom),
          addressFlatNumber: generatedAddress[1].buildingNumber,
        })
      );
    });

    it("should prepopulate with the current address when in editing current address route", () => {
      const generatedAddress = addressFactory(2);
      req.originalUrl = "/address/edit";
      req.sessionModel.set("addresses", generatedAddress);
      address.getValues(req, res, next);
      expect(next).to.have.been.calledOnce;
      expect(next).to.have.been.calledWith(
        null,
        sinon.match({
          addressPostcode: generatedAddress[0].postalCode,
          addressHouseNumber: generatedAddress[0].buildingNumber,
          addressHouseName: generatedAddress[0].buildingName,
          addressStreetName: generatedAddress[0].streetName,
          addressLocality: generatedAddress[0].addressLocality,
          addressYearFrom: Number(generatedAddress[0].validFrom),
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
        addressYearFrom: "2022",
      };

      req.body = addressToSave;

      await address.saveValues(req, res, next);

      const savedAddress = req.session.test.addresses[0];
      expect(next).to.have.been.calledOnce;
      expect(savedAddress.buildingNumber).to.equal(
        addressToSave.addressFlatNumber
      );
      expect(savedAddress.streetName).to.equal(addressToSave.addressStreetName);
      expect(savedAddress.addressLocality).to.equal(
        addressToSave.addressLocality
      );
      expect(savedAddress.buildingName).to.equal(
        addressToSave.addressHouseName
      );
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

      const savedAddress = req.session.test.addresses[0];
      expect(next).to.have.been.calledOnce;
      expect(savedAddress.buildingNumber).to.equal(
        addressToSave.addressHouseNumber
      );
      expect(savedAddress.streetName).to.equal(addressToSave.addressStreetName);
      expect(savedAddress.addressLocality).to.equal(
        addressToSave.addressLocality
      );
    });

    it("should append the address to the saved addresses", async () => {
      const addressToSave = {
        addressFlatNumber: "1a",
        addressHouseName: "My building",
        addressStreetName: "avenue",
        addressLocality: "large town",
        addressYearFrom: "2022",
      };

      const existingAddresses = addressFactory(1);
      req.sessionModel.set("addresses", existingAddresses);

      req.body = addressToSave;
      req.originalUrl = "/previous/address";

      await address.saveValues(req, res, next);

      const savedAddresses = req.session.test.addresses;
      const existingAddress = savedAddresses[0];
      const newAddress = savedAddresses[1];

      expect(next).to.have.been.calledOnce;
      expect(existingAddress).to.be.equal(existingAddresses[0]);
      expect(newAddress.buildingNumber).to.equal(
        addressToSave.addressFlatNumber
      );
      expect(newAddress.streetName).to.equal(addressToSave.addressStreetName);
      expect(newAddress.addressLocality).to.equal(
        addressToSave.addressLocality
      );
    });
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
    req.sessionModel.set("addresses", existingAddresses);

    req.body = addressToSave;

    await address.saveValues(req, res, next);

    const savedAddresses = req.session.test.addresses;

    expect(next).to.have.been.calledOnce;
    expect(savedAddresses[0].buildingName).to.equal(
      addressToSave.addressHouseName
    );
    expect(savedAddresses[0].buildingNumber).to.equal(
      addressToSave.addressFlatNumber
    );
    expect(savedAddresses[0].addressLocality).to.equal(
      addressToSave.addressLocality
    );
    expect(savedAddresses[0].addressStreetName).to.equal(
      addressToSave.streetName
    );
  });

  it("should overwrite the previous address when previous address already exists and in previous journey", async () => {
    const addressToSave = {
      addressFlatNumber: "1a",
      addressHouseName: "My building",
      addressStreetName: "avenue",
      addressLocality: "large town",
      addressYearFrom: "2022",
    };

    const existingAddresses = addressFactory(2);

    req.sessionModel.set("addresses", existingAddresses);
    req.originalUrl = "/previous/address/edit";
    req.body = addressToSave;

    await address.saveValues(req, res, next);

    const savedAddresses = req.session.test.addresses;
    const modifiedPreviousAddress = savedAddresses[1];
    expect(next).to.have.been.calledOnce;

    expect(modifiedPreviousAddress.buildingName).to.equal(
      addressToSave.addressHouseName
    );
    expect(modifiedPreviousAddress.buildingNumber).to.equal(
      addressToSave.addressFlatNumber
    );
    expect(modifiedPreviousAddress.addressLocality).to.equal(
      addressToSave.addressLocality
    );
    expect(modifiedPreviousAddress.addressStreetName).to.equal(
      addressToSave.streetName
    );
  });
});
