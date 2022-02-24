const BaseController = require("hmpo-form-wizard").Controller;
const AddressSearchController = require("./addressSearch");

const {
  ORDNANCE: { ORDNANCE_SURVEY_SECRET },
} = require("../../../lib/config");
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
    req.ordnanceAxios.get = sinon.fake.returns(testData.apiResponse);
    req.body["address-search"] = testPostcode;

    await addressSearch.saveValues(req, res, next);

    expect(next).to.have.been.calledOnce;
    expect(req.ordnanceAxios.get).to.have.been.calledWith(null, {
      params: {
        postcode: testPostcode,
        key: ORDNANCE_SURVEY_SECRET,
      },
    });
    expect(req.session.test.addressPostcode).to.equal(testPostcode);
    expect(req.session.test.searchResults[0].buildingNumber).to.equal("1");
    expect(req.session.test.searchResults[0].streetName).to.equal("SOME ROAD");
    expect(req.session.test.searchResults[0].town).to.equal("SOMEWHERE");
    expect(req.session.test.searchResults[0].postcode).to.equal("SOMEPOST");
    expect(req.session.test.searchResults[1].buildingNumber).to.equal(
      "NAMED BUILDING"
    );
    expect(req.session.test.requestIsSuccessful).to.equal(true);
  });

  it("Should not throw an error when api throws error", async () => {
    const testPostcode = "myPostcode";
    req.ordnanceAxios.get = sinon.fake.rejects();
    req.body["address-search"] = testPostcode;

    await addressSearch.saveValues(req, res, next);

    expect(next).to.have.been.calledOnce;
    expect(req.ordnanceAxios.get).to.have.been.calledWith(null, {
      params: {
        postcode: testPostcode,
        key: ORDNANCE_SURVEY_SECRET,
      },
    });
    expect(req.session.test.addressPostcode).to.equal(testPostcode);
    expect(req.session.test.requestIsSuccessful).to.equal(false);
  });
});
