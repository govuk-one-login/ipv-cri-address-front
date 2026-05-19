import { vi } from "vitest";

const JourneyModel = require("hmpo-form-wizard/lib/journey-model");
const WizardModel = require("hmpo-form-wizard/lib/wizard-model.js");

const mockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  headers: {},
  form: {},
  session: {},
  ...overrides,
});

const mockResponse = (overrides = {}) => {
  return {
    status: vi.fn().mockReturnThis(),
    statusCode: vi.fn().mockReturnThis(),
    message: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    redirect: vi.fn().mockReturnThis(),
    render: vi.fn().mockReturnThis(),
    locals: {},
    ...overrides,
  };
};
export const createDefaultReqResNext = () => {
  const req = mockRequest({
    url: "/",
    body: {},
    form: {
      options: {
        fields: {},
      },
      values: {},
    },
    axios: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
    },
    session: {
      "hmpo-wizard-previous": {},
    },
    headers: {
      "txma-audit-encoded": "dummy-txma-header",
      "x-forwarded-for": "198.51.100.10:46532",
    },
    ip: "127.0.0.1",
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

  const res = mockResponse({});
  const next = vi.fn();
  const err = vi.fn();
  return {
    req,
    res,
    next,
    err,
  };
};
