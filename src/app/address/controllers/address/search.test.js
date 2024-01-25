const BaseController = require("hmpo-form-wizard").Controller;
const AddressSearchController = require("./search");

const testData = require("../../../../../test/data/testData");

const {
  API: {
    PATHS: { POSTCODE_LOOKUP },
  },
} = require("../../../../lib/config");

let req;
let res;
let next;
let sandbox;
let addressSearch;
const sessionId = "session-id-123";

describe("Address Search controller", function () {
  beforeEach(() => {
    addressSearch = new AddressSearchController({ route: "/test" });
    sandbox = sinon.createSandbox();
    const setup = setupDefaultMocks();

    req = setup.req;
    res = setup.res;
    next = setup.next;
    req.session.tokenId = sessionId;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should be an instance of BaseController", () => {
    expect(addressSearch).to.be.an.instanceOf(BaseController);
  });

  describe("saveValues", () => {
    let testPostcode;

    it("Should call api with a postcode", async () => {
      testPostcode = "myPostcode";

      req.body["addressSearch"] = testPostcode;

      await addressSearch.saveValues(req, res, next);

      expect(req.axios.get).to.have.been.calledWith(
        `${POSTCODE_LOOKUP}/myPostcode`,
        {
          headers: {
            session_id: sessionId,
            "session-id": sessionId,
          },
        }
      );
    });

    describe("on api success", () => {
      let prototypeSpy;
      let testPostcode;

      beforeEach(async () => {
        prototypeSpy = sinon.stub(BaseController.prototype, "saveValues");
        BaseController.prototype.saveValues.callThrough();

        req.axios.get = sinon.fake.returns(testData.apiResponse);

        testPostcode = "myPostcode";
        req.body["addressSearch"] = testPostcode;

        await addressSearch.saveValues(req, res, next);
      });

      afterEach(() => {
        prototypeSpy.restore();
      });

      it("should set requestIsSuccessful to be true", () => {
        expect(req.sessionModel.get("requestIsSuccessful")).to.be.true;
      });
      it("should set searchResults", () => {
        expect(req.sessionModel.get("searchResults")).to.equal(
          testData.apiResponse.data
        );
      });
      it("should set addressPostcode", () => {
        expect(req.sessionModel.get("addressPostcode")).to.equal(testPostcode);
      });

      it("should call callback", () => {
        expect(next).to.have.been.calledOnce;
      });
    });

    describe("on api error", () => {
      beforeEach(async () => {
        req.axios.get = sinon.fake.rejects(new Error("Error!"));

        testPostcode = "myPostcode";
        req.body["addressSearch"] = testPostcode;

        await addressSearch.saveValues(req, res, next);
      });
      it("should set requestIsSuccessful to be false", () => {
        expect(req.sessionModel.get("requestIsSuccessful")).to.be.false;
      });
      it("should set searchResults", () => {
        expect(req.sessionModel.get("searchResults")).to.equal(undefined);
      });
      it("should set checkDetailsHeader", () => {
        expect(req.sessionModel.get("checkDetailsHeader")).to.equal(false);
      });
      it("should set addressPostcode", () => {
        expect(req.sessionModel.get("addressPostcode")).to.equal(testPostcode);
      });
      it("should call callback without an error", () => {
        expect(next).to.have.been.calledOnceWithExactly();
      });
    });
  });
});
