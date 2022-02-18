const middleware = require("./middleware");
const {
  API: {
    PATHS: { AUTHORIZE },
  },
} = require("../../lib/config");

describe("oauth middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    const setup = setupDefaultMocks();
    req = setup.req;
    res = setup.res;
    next = setup.next;
  });

  describe("addAuthParamsToSession", () => {
    beforeEach(() => {
      req = {
        query: {
          response_type: "code",
          client_id: "s6BhdRkqt3",
          state: "xyz",
          redirect_uri: "https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb",
          unusedParam: "not used",
        },
        session: {},
      };
    });

    it("should save authParams to session", async function () {
      await middleware.addAuthParamsToSession(req, res, next);

      expect(req.session.authParams).to.deep.equal({
        response_type: req.query.response_type,
        client_id: req.query.client_id,
        state: req.query.state,
        redirect_uri: req.query.redirect_uri,
      });
    });

    it("should call next", async function () {
      await middleware.addAuthParamsToSession(req, res, next);

      expect(next).to.have.been.called;
    });
  });

  describe("retrieveAuthorizationCode", () => {
    let authResponse;

    beforeEach(() => {
      req.session = {
        authParams: {
          response_type: "code",
          client_id: "s6BhdRkqt3",
          state: "xyz",
          redirect_uri: "https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb",
          scope: "openid",
        },
      };

      authResponse = {
        data: {
          code: {
            value: "12345",
          },
        },
      };

      req.axios.get = sinon.fake.returns(authResponse);
    });

    context("auth request", () => {
      it("should call axios with correct parameters", async () => {
        req.session.ipvSessionId = "abadcafe";

        await middleware.retrieveAuthorizationCode(req, res, next);

        expect(req.axios.get).to.have.been.calledWith(
          AUTHORIZE,
          sinon.match({
            params: { ...req.session.authParams },
          })
        );
      });
    });

    context("with authorization code", () => {
      it("should set authorization_code on req", async () => {
        await middleware.retrieveAuthorizationCode(req, res, next);

        expect(req.authorization_code).to.eq("12345");
      });
      it("it should call next", async () => {
        await middleware.retrieveAuthorizationCode(req, res, next);

        expect(next).to.have.been.called;
      });
    });

    context("with missing authorization code", () => {
      beforeEach(() => {
        delete authResponse.data.code;
      });

      it("should send a 500 error when code is missing", async function () {
        await middleware.retrieveAuthorizationCode(req, res);

        expect(res.status).to.have.been.calledWith(500);
      });

      it("should not call next", async function () {
        await middleware.retrieveAuthorizationCode(req, res);

        expect(next).to.not.have.been.called;
      });
    });

    context("with axios error", () => {
      let errorMessage;

      beforeEach(() => {
        errorMessage = "server error";
        req.axios.get = sinon.fake.throws(new Error(errorMessage));
      });

      it("should send call next with error when code is missing", async () => {
        await middleware.retrieveAuthorizationCode(req, res, next);

        expect(next).to.have.been.calledWith(
          sinon.match
            .instanceOf(Error)
            .and(sinon.match.has("message", errorMessage))
        );
      });
    });
  });

  describe("redirectToCallback", () => {
    beforeEach(() => {
      req.session = {
        authParams: {
          redirect_uri: "https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb",
        },
      };
      req.authorization_code = "1234";

      req.axios.get = sinon.fake.returns({});
    });

    it("should successfully redirects when code is valid", async function () {
      await middleware.redirectToCallback(req, res);

      expect(res.redirect).to.have.been.calledWith(
        `https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb?code=1234`
      );
    });
  });
});
