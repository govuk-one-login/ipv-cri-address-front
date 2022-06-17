const { setAPIConfig, setOAuthPaths } = require("./settings");

describe("settings", () => {
  let app;

  beforeEach(() => {
    app = {
      set: sinon.stub(),
    };
  });

  describe("setAPIConfig", () => {
    it("should set 'API.API_BASE_URL", () => {
      setAPIConfig({ app, baseUrl: "http://example.com" });

      expect(app.set).to.have.been.calledWith(
        "API.BASE_URL",
        "http://example.com"
      );
    });

    it("should set 'API.PATHS.AUTHORIZE", () => {
      setAPIConfig({ app, sessionPath: "/api/session" });

      expect(app.set).to.have.been.calledWith(
        "API.PATHS.SESSION",
        "/api/session"
      );
    });

    it("should set 'API.PATHS.AUTHORIZE", () => {
      setAPIConfig({ app, authorizationPath: "/api/auth" });

      expect(app.set).to.have.been.calledWith(
        "API.PATHS.AUTHORIZATION",
        "/api/auth"
      );
    });
  });

  describe("setOAuthPaths", () => {
    it("should set 'APP.PATHS.ENTRYPOINT", () => {
      setOAuthPaths({ app, entryPointPath: "/website/subpath" });

      expect(app.set).to.have.been.calledWith(
        "APP.PATHS.ENTRYPOINT",
        "/website/subpath"
      );
    });
  });
});
