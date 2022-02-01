const BaseController = require("hmpo-form-wizard").Controller;
const AddressSearchController = require("./addressSearch");

// const proxyquire = require("proxyquire");
const axios = require("axios");
const reqres = require("reqres");
const WizardModel = require("hmpo-form-wizard/lib/wizard-model.js");
const JourneyModel = require("hmpo-form-wizard/lib/journey-model");

const {
  ORDNANCE: { ORDNANCE_API_URL, ORDNANCE_SURVEY_SECRET },
} = require("../../../lib/config");

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

  req.form = { values: {} };
  res = sinon.fake();
  next = sinon.fake();
});

afterEach(() => {
  sandbox.restore();
});

describe("Address Search controller", () => {
  let addressSearch;

  beforeEach(() => {
    addressSearch = new AddressSearchController({ route: "/test" });
  });

  it("should be an instance of BaseController", () => {
    expect(addressSearch).to.be.an.instanceOf(BaseController);
  });

  it("Should call api with a postcode and save results to session", async () => {
    const testPostcode = "myPostcode";
    const axiosStub = sinon.stub(axios, "get").resolves(testData.apiResponse);
    req.body["address-lookup"] = testPostcode;

    await addressSearch.saveValues(req, res, next);

    expect(axiosStub).to.have.been.calledWith(
      `${ORDNANCE_API_URL}postcode=${testPostcode}&key=${ORDNANCE_SURVEY_SECRET}`
    );
    expect(next).to.have.been.calledOnce;
    expect(req.session.test.searchResults[0].buildingNumber).to.equal("1");
    expect(req.session.test.searchResults[0].streetName).to.equal("SOME ROAD");
    expect(req.session.test.searchResults[0].town).to.equal("SOMEWHERE");
    expect(req.session.test.searchResults[0].postcode).to.equal("SOMEPOST");
    expect(req.session.test.searchResults[1].buildingNumber).to.equal(
      "NAMED BUILDING"
    );
  });
});
