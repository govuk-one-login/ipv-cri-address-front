const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
const JourneyModel = require("hmpo-form-wizard/lib/journey-model");
const WizardModel = require("hmpo-form-wizard/lib/wizard-model.js");

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect = chai.expect;

global.sinon = sinon;
global.expect = expect;

global.setupDefaultMocks = () => {
  const req = {
    url: "/",
    body: {},
    form: {
      options: {
        fields: {},
      },
      values: {},
    },
    axios: {
      get: sinon.fake(),
      post: sinon.fake(),
      put: sinon.fake(),
    },
    session: {
      "hmpo-wizard-previous": {},
    },
    headers: {
      "txma-audit-encoded": "dummy-txma-header",
      "x-forwarded-for": "198.51.100.10:46532",
    },
    ip: "127.0.0.1",
  };

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

  const res = {};
  const next = sinon.fake();
  return {
    req,
    res,
    next,
  };
};
