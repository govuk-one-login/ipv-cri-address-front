const BaseController = require("hmpo-form-wizard").Controller;
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

  it("should save the address into the session", async () => {
    const addressToSave = {
      addressLine1: "10a",
      addressLine2: "street road",
      addressTown: "small town",
    };

    req.body = addressToSave;

    await address.saveValues(req, res, next);

    const savedAddress = req.session.test.addresses[0];
    expect(next).to.have.been.calledOnce;
    expect(savedAddress.addressLine1).to.equal(addressToSave.addressLine1);
    expect(savedAddress.addressLine2).to.equal(addressToSave.addressLine2);
    expect(savedAddress.addressTown).to.equal(addressToSave.addressTown);
  });
});
