const proxyquire = require("proxyquire");

let axiosStub = {};

const axios = proxyquire("./axios", {
  axios: axiosStub,
  "./config": {
    API: {
      BASE_URL: "http://example.net",
    },
  },
});

describe("axios", () => {
  let req;
  let res;
  let next;

  let axiosClient;

  beforeEach(() => {
    const setup = setupDefaultMocks();
    req = setup.req;
    res = setup.res;
    next = setup.next;

    axiosClient = {};

    axiosStub.create = sinon.fake.returns(axiosClient);
  });

  it("should create 'axios' with BASE_URL", () => {
    axios(req, res, next);

    expect(axiosStub.create).to.have.been.calledWith({
      baseURL: "http://example.net",
    });
  });

  it("should add 'axios' on 'req'", () => {
    axios(req, res, next);

    expect(req.axios).to.equal(axiosClient);
  });

  context("with 'scenarioIdHeader'", () => {
    it("should add x-scenario-id to axios headers", () => {
      axiosClient.defaults = { headers: { common: {} } };

      req.scenarioIDHeader = "test-scenario-success";

      axios(req, res, next);

      expect(req.axios.defaults.headers.common["x-scenario-id"]).to.equal(
        "test-scenario-success"
      );
    });
  });

  context("without 'scenarioIdHeader'", () => {
    it("should not x-scenario-id to axios headers", () => {
      delete req.scenarioIdHeader;

      axios(req, res, next);

      expect(req.axios?.defaults?.headers?.common?.["x-scenario-id"]).to.be
        .undefined;
    });
  });

  context("without defaults'", () => {
    it("should not x-scenario-id to axios headers", () => {
      delete axiosClient.defaults;
      req.scenarioIdHeader = "test-scenario-success";

      axios(req, res, next);

      expect(req.axios?.defaults?.headers?.common?.["x-scenario-id"]).to.be
        .undefined;
    });
  });
});
