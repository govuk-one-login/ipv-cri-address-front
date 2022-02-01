const BaseController = require("hmpo-form-wizard").Controller;
const AddressResultController = require("./addressResults");

const reqres = require("reqres");
const WizardModel = require("hmpo-form-wizard/lib/wizard-model.js");
const JourneyModel = require("hmpo-form-wizard/lib/journey-model");

const testData = require("../../../../test/data/testData");

let req;
let res;
let next;
let sandbox;

beforeEach(() => {
  sandbox = sinon.createSandbox();

  req = reqres.req();
  req.journeyModel = new JourneyModel(null, {
    req,
    key: "test",
  });
  req.sessionModel = new WizardModel(null, {
    req,
    key: "test",
    journeyModel: req.journeyModel,
    fields: {},
  });
  res = sinon.fake();

  req.form = { values: {} };

  next = sinon.fake();
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

    req.body["address-selection"] = expectedResponse.label;

    req.sessionModel.set("searchResults", testData.formattedAddressed);

    await addressResult.saveValues(req, res, next);
    expect(req.session.test.addressLine1).to.equal(
      `${expectedResponse.buildingNumber}`
    );
    expect(req.session.test.addressLine2).to.equal(
      `${expectedResponse.streetName}`
    );
    expect(req.session.test.addressTown).to.equal(`${expectedResponse.town}`);

    expect(req.session.test.addressPostcode).to.equal(
      `${expectedResponse.postcode}`
    );
  });
});
