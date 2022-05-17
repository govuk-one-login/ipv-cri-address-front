const proxyquire = require("proxyquire");

const cfenvStub = {};

const redis = proxyquire("./redis", {
  cfenv: cfenvStub,
  "../lib/config": {
    REDIS: { SESSION_URL: "example.org", PORT: "4321" },
  },
});

describe("redis", () => {
  context("with cfenv appvars", () => {
    beforeEach(() => {
      const getServiceURL = sinon.fake.returns("rediss://example.net");
      cfenvStub.getAppEnv = sinon.stub().returns({
        getServiceURL,
      });
    });
    it("should return config using 'session-cache' service url", () => {
      const redisConfig = redis();

      expect(redisConfig).to.include({
        connectionString: "rediss://example.net",
      });
    });
  });

  context("with environment variables", () => {
    beforeEach(() => {});
    it("should return config using environment variables", () => {
      cfenvStub.getAppEnv = sinon.stub().returns({
        getServiceURL: sinon.fake(),
      });

      const redisConfig = redis();

      expect(redisConfig).to.include({
        connectionString: "redis://example.org:4321",
      });
    });
  });
});
