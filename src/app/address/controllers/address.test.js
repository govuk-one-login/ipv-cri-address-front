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
    req.body = {
      addressLine1: "10a",
      addressLine2: "street road",
      addressTown: "small town",
    };
    await address.saveValues(req, res, next);

    expect(next).to.have.been.calledOnce;
    expect(req.session.test.addressLine1).to.equal(req.body["addressLine1"]);
    expect(req.session.test.addressLine2).to.equal(req.body["addressLine2"]);
    expect(req.session.test.addressTown).to.equal(req.body["addressTown"]);
  });
});
