const { expect } = require("chai");
const BaseController = require("hmpo-form-wizard").Controller;
const WhatCountryController = require("./whatCountry");

const address = new WhatCountryController({ route: "/test" });

describe("whatCountryController", () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    req = {
      sessionModel: {
        get: sandbox.stub(),
        set: sandbox.stub(),
      },
    };
  });

  afterEach(() => sandbox.restore());

  it("should set country to empty string", (done) => {
    sandbox
      .stub(BaseController.prototype, "getValues")
      .callsFake((_, __, callback) => callback(null, {}));

    req.sessionModel.set("country", "test");
    address.getValues(req, res, (err, values) => {
      expect(values.country).to.be.eq("");
      done();
    });
  });

  it("should call callback with error if there is one present", (done) => {
    sandbox
      .stub(BaseController.prototype, "getValues")
      .callsFake((_, __, callback) => callback(error, {}));

    const error = new Error("dummy-error");

    req.sessionModel.set("country", "test");

    address.getValues(req, res, (err, values) => {
      expect(err).to.equal(error);
      expect(values.country).to.be.eq("");
      done();
    });
  });

  it("should call callback without error if there is none present", (done) => {
    sandbox
      .stub(BaseController.prototype, "getValues")
      .callsFake((_, __, callback) => callback(null, {}));

    req.sessionModel.set("country", "test");

    address.getValues(req, res, (err, values) => {
      expect(err).to.equal(null);
      expect(values.country).to.be.eq("");
      done();
    });
  });
});
