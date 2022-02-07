const BaseController = require("hmpo-form-wizard").Controller;
const AddressConfirmController = require("./addressConfirm");

const reqres = require("reqres");
const WizardModel = require("hmpo-form-wizard/lib/wizard-model.js");
const JourneyModel = require("hmpo-form-wizard/lib/journey-model");

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
