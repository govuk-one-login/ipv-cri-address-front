const {
  addOAuthPropertiesToSessionModel,
  buildRedirectUrl,
} = require("./oauth");

describe("oauth lib", () => {
  describe("addOAuthPropertiesToSessionModel", () => {
    let sessionModel;
    let data;
    let setSpy;

    beforeEach(() => {
      const setup = setupDefaultMocks();
      sessionModel = setup.req?.sessionModel;

      setSpy = sinon.spy(sessionModel, "set");
      data = {};
    });

    afterEach(() => {
      setSpy.restore();
    });

    it("should save 'redirect_url' to sessionModel", () => {
      data.redirect_uri = "http://example.net";

      addOAuthPropertiesToSessionModel({ sessionModel, data });

      expect(setSpy).to.have.been.calledWith("redirect_url", data.redirect_uri);
    });

    it("should save 'state' to sessionModel", () => {
      data.state = "http://example.net";

      addOAuthPropertiesToSessionModel({ sessionModel, data });

      expect(setSpy).to.have.been.calledWith("state", data.state);
    });

    describe("with authorization_code", () => {
      it("should save 'authorization_code' to sessionModel", () => {
        data.code = "C0DE";

        addOAuthPropertiesToSessionModel({ sessionModel, data });

        expect(setSpy).to.have.been.calledWith("authorization_code", data.code);
      });
    });

    describe("without authorization_code", () => {
      it("should save 'error' to sessionModel", () => {
        addOAuthPropertiesToSessionModel({ sessionModel, data });

        expect(setSpy).to.have.been.calledWith("error", {
          code: "server_error",
          error_description: "Failed to retrieve authorization code",
        });
      });
    });
  });

  describe("buildRedirectUrl", () => {
    let sessionModel;
    let authParams;
    let redirectUrl;

    it("should throw an error if redirect_url is not valid", () => {
      sessionModel = {
        redirect_url: "not-a-valid-url",
      };

      expect(() => buildRedirectUrl({ sessionModel, authParams }))
        .to.throw(TypeError)
        .with.property("code", "ERR_INVALID_URL");
    });

    it("should use the redirect_url if valid", () => {
      sessionModel = {
        redirect_url: "http://example.org",
      };

      buildRedirectUrl({ sessionModel, authParams });
    });

    context("with an authorization_code", () => {
      beforeEach(() => {
        sessionModel = {
          redirect_url: "http://example.org",
          authorization_code: "1234",
          state: "STATE",
        };

        authParams = {
          client_id: "client",
        };

        redirectUrl = buildRedirectUrl({ sessionModel, authParams });
      });

      it("should add authorization_code", () => {
        expect(redirectUrl.searchParams.get("code")).to.equal(
          sessionModel.authorization_code
        );
      });
      it("should add client_id", () => {
        expect(redirectUrl.searchParams.get("client_id")).to.equal(
          authParams.client_id
        );
      });
      it("should add state", () => {
        expect(redirectUrl.searchParams.get("state")).to.equal(
          sessionModel.state
        );
      });
    });
    context("without an authorization_code", () => {
      describe("with an error object", () => {
        let error;
        beforeEach(() => {
          error = {
            code: "E_ERROR",
            message: "Error Message",
            description: "Error Description",
          };

          sessionModel = {
            redirect_url: "http://example.org",
            error,
          };

          authParams = {};
        });

        it("should add the error code", () => {
          redirectUrl = buildRedirectUrl({ sessionModel, authParams });

          expect(redirectUrl.searchParams.get("error")).to.equal(error.code);
        });
        it("should add the error description if available", () => {
          redirectUrl = buildRedirectUrl({ sessionModel, authParams });

          expect(redirectUrl.searchParams.get("error_description")).to.equal(
            error.description
          );
        });
        it("should add the error message as a fallback", () => {
          delete error.description;
          redirectUrl = buildRedirectUrl({ sessionModel, authParams });

          expect(redirectUrl.searchParams.get("error_description")).to.equal(
            error.message
          );
        });
      });
      describe("without an error object", () => {});
    });
  });
});
