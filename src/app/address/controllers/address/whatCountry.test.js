const { expect } = require("chai");
const BaseController = require("hmpo-form-wizard").Controller;
const WhatCountryController = require("./whatCountry");

const address = new WhatCountryController({ route: "/test" });

describe("whatCountryController", () => {
  let req, res, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    sandbox
      .stub(BaseController.prototype, "getValues")
      .callsFake((_, __, callback) => callback(null, {}));
    req = {
      sessionModel: {
        get: sandbox.stub(),
        set: sandbox.stub(),
      },
    };
  });

  afterEach(() => sandbox.restore());

  it("should set country to empty string", (done) => {
    req.sessionModel.set("country", "test");
    address.getValues(req, res, (err, values) => {
      expect(values.country).to.be.eq("");
      done();
    });
  });
});
