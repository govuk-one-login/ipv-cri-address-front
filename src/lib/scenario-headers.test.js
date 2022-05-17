const scenarioHeaders = require("./scenario-headers");

describe("scenario-headers", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    const setup = setupDefaultMocks();
    req = setup.req;
    req["x-scenario-id"] = "scenario-number-1";

    res = setup.res;
    next = setup.next;
  });

  context("with 'NODE_ENV' as 'development'", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
      scenarioHeaders(req, res, next);
    });

    it("should set scenarioHeader on req", () => {
      expect((req.scenarioIdHeader = "scenario-number-1"));
    });

    it("should call next", () => {
      expect(next).to.have.been.called;
    });
  });
  context("with 'NODE_ENV' not as 'development'", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
      scenarioHeaders(req, res, next);
    });

    it("should not set scenarioHeader on req", () => {
      expect(req.scenarioIdHeader).to.be.undefined;
    });

    it("should call next", () => {
      expect(next).to.have.been.called;
    });
  });

  context('with missing "x-scenario-id" header', () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
      delete req["x-scenario-id"];

      scenarioHeaders(req, res, next);
    });

    it("should not set scenarioHeader on req", () => {
      expect(req.scenarioIdHeader).to.be.undefined;
    });

    it("should call next", () => {
      expect(next).to.have.been.called;
    });
  });
});
