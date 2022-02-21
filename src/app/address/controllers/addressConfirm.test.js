const BaseController = require("hmpo-form-wizard").Controller;
const AddressConfirmController = require("./addressConfirm");

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

  it("Should format the address in locals", async () => {
    const houseNameNumber = "1 HOUSE";
    const street = "STREET";
    const town = "TOWN";
    const postcode = "POSTCODE";

    req.sessionModel.set("addressLine1", houseNameNumber);
    req.sessionModel.set("addressLine2", street);
    req.sessionModel.set("addressTown", town);
    req.sessionModel.set("addressPostcode", postcode);

    const formattedAddress = `${houseNameNumber}<br>${street},</br>${town},</br>${postcode},</br>`;

    addressConfirm.locals(req, res, next);
    expect(next).to.have.been.calledOnce;
    expect(next).to.have.been.calledWith(null, {
      formattedAddress,
    });
  });
});
