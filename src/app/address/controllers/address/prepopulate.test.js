const BaseController = require("hmpo-form-wizard").Controller;
const PrepopulateController = require("./prepopulate");

const { API } = require("../../../../lib/config");

let req;
let res;
let next;
let sandbox;
const sessionId = "session-id-123";

describe("Prepopulate controller", () => {
  let prepopulateController;

  beforeEach(() => {
    prepopulateController = new PrepopulateController({ route: "/test" });
    sandbox = sinon.createSandbox();
    const setup = setupDefaultMocks();

    req = setup.req;
    res = setup.res;
    next = setup.next;
    req.session.tokenId = sessionId;

    req.headers = {
      "txma-audit-encoded": "dummy-txma-header",
      "x-forwarded-for": "198.51.100.10:46532",
    };
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should be an instance of BaseController", () => {
    expect(prepopulateController).to.be.an.instanceOf(BaseController);
  });

  describe("#saveValues", () => {
    it("should retrieve addresses", async () => {
      await prepopulateController.saveValues(req, res, next);

      const headers = {
        "session-id": sessionId,
        session_id: sessionId,
        "txma-audit-encoded": "dummy-txma-header",
        "x-forwarded-for": "127.0.0.1",
      };

      expect(req.axios.get).to.have.been.calledWith(API.PATHS.GET_ADDRESSES, {
        headers,
      });
    });

    context("on success", () => {
      let prototypeSpy;

      beforeEach(() => {
        prototypeSpy = sinon.stub(BaseController.prototype, "saveValues");
        BaseController.prototype.saveValues.callThrough();
      });

      afterEach(() => {
        prototypeSpy.restore();
      });

      describe("with empty addresses", () => {
        beforeEach(async () => {
          req.axios.get = sinon.fake.resolves([]);

          await prepopulateController.saveValues(req, res, next);
        });

        it("should set not addressPostcode", () => {
          expect(req.sessionModel.get("addressSearch")).to.be.undefined;
        });

        it("should set prepopulatedPostcode to be false", () => {
          expect(req.session.prepopulatedPostcode).to.be.false;
        });

        it("should call callback", async () => {
          expect(next).to.have.been.calledOnce;
        });
      });
    });

    describe("with addresses", () => {
      beforeEach(async () => {
        req.axios.get = sinon.fake.resolves({
          data: [{ postalCode: "Q1 1AB" }],
        });

        await prepopulateController.saveValues(req, res, next);
      });

      it("should set prepopulatedPostcode to be true", () => {
        expect(req.session.prepopulatedPostcode).to.be.true;
      });

      it("should set addressPostcode using first postcode in results", () => {
        expect(req.sessionModel.get("addressSearch")).to.equal("Q1 1AB");
      });

      it("should call callback", async () => {
        expect(next).to.have.been.calledOnce;
      });
    });

    context("on error", () => {
      beforeEach(async () => {
        req.axios.get = sinon.fake.throws(new Error("Error"));

        await prepopulateController.saveValues(req, res, next);
      });

      it("should call callback", () => {
        expect(next).to.have.been.calledOnce;
      });
    });
  });
});
