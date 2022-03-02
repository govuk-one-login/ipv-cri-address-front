const BaseController = require("hmpo-form-wizard").Controller;
const AddressConfirmController = require("./addressConfirm");
const addressFactory = require("../../../../test/utils/addressFactory");

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

afterEach(() => {
  sandbox.restore();
});

describe("Address confirmation controller", () => {
  let addressConfirm;

  beforeEach(() => {
    addressConfirm = new AddressConfirmController({ route: "/test" });
  });

  it("should be an instance of BaseController", () => {
    expect(addressConfirm).to.be.an.instanceOf(BaseController);
  });

  it("Should format the current address and previous addresses in locals", async () => {
    const addresses = addressFactory(3);

    req.sessionModel.set("addresses", addresses);

    const formattedAddresses = addresses.map((address) => {
      return `${address.addressLine1}<br>${address.addressLine2},<br>${address.addressTown},<br>${address.addressPostcode}<br>`;
    });

    const currentAddress = formattedAddresses.shift();
    const params = {
      formattedAddress: currentAddress,
      previousAddresses: formattedAddresses,
    };

    addressConfirm.locals(req, res, next);
    expect(next).to.have.been.calledOnce;
    expect(next).to.have.been.calledWith(null, params);
  });
});
