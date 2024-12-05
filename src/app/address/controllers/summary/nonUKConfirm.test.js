const BaseController = require("hmpo-form-wizard").Controller;
const NonUKAddressConfirmController = require("./nonUKConfirm");
const addressFactory = require("../../../../../test/utils/addressFactory");
const { expect } = require("chai");
const testData = require("../../../../../test/data/testData");
const {
  API: {
    PATHS: { SAVE_ADDRESS },
  },
} = require("../../../../lib/config");

let req;
let res;
let next;
let sandbox;
let addresses = [];
let addressConfirm;
const sessionId = "session-id-123";

describe("Non UK Address confirmation controller", () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    const setup = setupDefaultMocks();

    req = setup.req;
    res = setup.res;
    next = setup.next;
    req.session.tokenId = sessionId;
    req.session.authParams = {};
    req.translate = sinon.stub();
    req.translate.returns("United Kingdom");

    addresses = addressFactory(1);
    req.journeyModel.set("currentAddress", addresses[0]);
    addressConfirm = new NonUKAddressConfirmController({ route: "/test" });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should be an instance of BaseController", () => {
    expect(addressConfirm).to.be.an.instanceOf(BaseController);
  });

  describe("locals", () => {
    it("Should format the current address in locals", async () => {
      const params = {
        currentAddressRowValue:
          "flat 1<br>1<br>street1<br>town1<br>postcode1<br>United Kingdom",
        validFromRow: new Date().getFullYear(),
        changeCurrentHref: "/enter-non-UK-address?edit=true",
      };

      addressConfirm.locals(req, res, next);
      expect(next).to.have.been.calledOnce;
      expect(next).to.have.been.calledWith(null, params);
    });

    it("Should call callback with an error when no address is found", async () => {
      req.journeyModel.set("currentAddress", null);
      addressConfirm.locals(req, res, next);

      const errMessage = "No address found";
      const callbackError = next.firstArg;
      expect(next).to.have.been.calledOnce;
      expect(callbackError).to.be.instanceOf(Error);
      expect(callbackError.message).to.equal(errMessage);
    });
  });

  describe("saveValues", () => {
    it("Should put address to address api and redirect back to callback", async () => {
      req.axios.put = sinon.fake.resolves(testData.addressApiResponse);

      const headers = {
        "session-id": sessionId,
        session_id: sessionId,
        "txma-audit-encoded": "dummy-txma-header",
        "x-forwarded-for": "127.0.0.1",
      };

      await addressConfirm.saveValues(req, res, next);
      expect(req.axios.put).to.have.been.calledWith(SAVE_ADDRESS, addresses, {
        headers,
      });

      expect(next).to.have.been.calledWith();
    });

    it("should return an error when no addresses are found", async () => {
      req.journeyModel.set("currentAddress", null);

      await addressConfirm.saveValues(req, res, next);

      const errMessage = "No address found";
      const callbackError = next.firstArg;
      expect(next).to.have.been.calledOnce;
      expect(callbackError).to.be.instanceOf(Error);
      expect(callbackError.message).to.equal(errMessage);
      expect(next).to.have.been.calledWith();
    });
  });

  it("Should handle put address throwing an error and redirect back to callback", async () => {
    req.axios.put = sinon.fake.throws(new Error("Some error"));

    await addressConfirm.saveValues(req, res, next);

    const errMessage = "Some error";
    const callbackError = next.firstArg;
    expect(next).to.have.been.calledOnce;
    expect(callbackError).to.be.instanceOf(Error);
    expect(callbackError.message).to.equal(errMessage);
    expect(next).to.have.been.calledWith();
  });
});
