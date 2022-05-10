const BaseController = require("hmpo-form-wizard").Controller;
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
    expect(savedAddress.buildingName).to.equal(addressToSave.addressHouseName);
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

    await address.saveValues(req, res, next);

    const savedAddresses = req.session.test.addresses;
    const existingAddress = savedAddresses[0];
    const newAddress = savedAddresses[1];

    expect(next).to.have.been.calledOnce;
    expect(existingAddress).to.be.equal(existingAddresses[0]);
    expect(newAddress.buildingNumber).to.equal(addressToSave.addressFlatNumber);
    expect(newAddress.streetName).to.equal(addressToSave.addressStreetName);
    expect(newAddress.addressLocality).to.equal(addressToSave.addressLocality);
  });
});
