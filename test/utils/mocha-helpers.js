const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const chaiAsPromised = require("chai-as-promised");
const reqres = require("reqres");
const JourneyModel = require("hmpo-form-wizard/lib/journey-model");
const WizardModel = require("hmpo-form-wizard/lib/wizard-model.js");

chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect = chai.expect;

global.sinon = sinon;
global.expect = expect;

global.setupDefaultMocks = () => {
  const req = reqres.req({
    form: { values: {} },
    axios: {
      get: sinon.fake(),
      post: sinon.fake(),
      put: sinon.fake(),
    },
  });

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

  const res = reqres.res({});
  const next = sinon.fake();
  return {
    req,
    res,
    next,
  };
};
