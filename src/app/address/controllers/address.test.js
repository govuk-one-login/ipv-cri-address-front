const BaseController = require("hmpo-form-wizard").Controller;
const AddressController = require("./address");
const reqres = require("reqres");
const WizardModel = require("hmpo-form-wizard/lib/wizard-model.js");
const JourneyModel = require("hmpo-form-wizard/lib/journey-model");

describe("address controller", () => {
  const address = new AddressController({ route: "/test" });

  let req;
  let res;
  let next;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    // Set request object.
    req = reqres.req();
    req.journeyModel = new JourneyModel(null, {
      req,
      key: "test",
    });

    afterEach(() => sandbox.restore());

    req.sessionModel = new WizardModel(null, {
      req,
      key: "test",
      journeyModel: req.journeyModel,
      fields: {},
    });

    req.form = { values: {} };

    // set response object.
    res = {
      status: sinon.fake(),
      redirect: sinon.fake(),
      send: sinon.fake(),
      render: sinon.fake(),
    };

    // set next object
    next = sinon.fake();
  });

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
