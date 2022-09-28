const BaseController = require("hmpo-form-wizard").Controller;
const PrepopulateController = require("./prepopulate");

const {
  API: {
    PATHS: { GET_ADDRESSES },
  },
} = require("../../../../lib/config");

let req;
let res;
let next;
let sandbox;
const sessionId = "session-id-123";

describe("Prepopulate controller", () => {
  let prepopulateController;

  beforeEach(() => {
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

  beforeEach(() => {
    prepopulateController = new PrepopulateController({ route: "/test" });
  });

  it("should be an instance of BaseController", () => {
    expect(prepopulateController).to.be.an.instanceOf(BaseController);
  });

  describe("#saveValues", () => {
    it("should retrieve addresses", async () => {
      await prepopulateController.saveValues(req, res, next);

      expect(req.axios.get).to.have.been.calledWith(GET_ADDRESSES, {
        headers: {
          session_id: sessionId,
          "session-id": sessionId,
        },
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

      it("should call super.saveValues", async () => {
        await prepopulateController.saveValues(req, res, next);

        expect(prototypeSpy).to.have.been.calledWith(req, res);
      });

      describe("with empty addresses", () => {
        beforeEach(async () => {
          req.axios.get = sinon.fake.resolves([]);

          await prepopulateController.saveValues(req, res, next);
        });

        it("should set addressPostcode using first postcode in results", () => {
          expect(req.sessionModel.get("addressSearch")).to.be.undefined;
        });
      });

      it("should call callback", async () => {
        req.axios.get = sinon.fake.resolves([]);

        await prepopulateController.saveValues(req, res, next);

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
