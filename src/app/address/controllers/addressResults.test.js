const BaseController = require("hmpo-form-wizard").Controller;
const AddressResultController = require("./addressResults");

const testData = require("../../../../test/data/testData");

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

describe("Address result controller", () => {
  let addressResult;

  beforeEach(() => {
    addressResult = new AddressResultController({ route: "/test" });
  });

  it("should be an instance of BaseController", () => {
    expect(addressResult).to.be.an.instanceOf(BaseController);
  });

  it("Should set the chosen address in the session", async () => {
    const expectedResponse = testData.formattedAddressed[1];

    req.body["address-selection"] = expectedResponse.value;

    req.sessionModel.set("searchResults", testData.formattedAddressed);

    await addressResult.saveValues(req, res, next);

    expect(next).to.have.been.calledOnce;
    expect(req.session.test.addresses[0].buildingNumber).to.equal(
      expectedResponse.buildingNumber
    );
    expect(req.session.test.addresses[0].streetName).to.equal(
      expectedResponse.streetName
    );
    expect(req.session.test.addresses[0].postcode).to.equal(
      expectedResponse.postcode
    );
    expect(req.session.test.addresses[0].postTown).to.equal(
      expectedResponse.postTown
    );
  });
});
