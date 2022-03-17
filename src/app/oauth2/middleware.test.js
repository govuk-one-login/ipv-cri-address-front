const middleware = require("./middleware");
const {
  API: {
    PATHS: { AUTHORIZATION_CODE, AUTHORIZE },
  },
  APP: {
    PATHS: { ADDRESS },
  },
} = require("../../lib/config");
const { expect } = require("chai");

const exampleJwt =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

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

  describe("addJWTToRequest", () => {
    beforeEach(() => {
      req = {
        query: {
          request: exampleJwt,
        },
      };
    });

    it("should save authParams to session", async function () {
      await middleware.addJWTToRequest(req, res, next);

      expect(req.jwt).to.equal(req.query.request);
    });

    it("should call next", async function () {
      await middleware.addJWTToRequest(req, res, next);

      expect(next).to.have.been.called;
    });
  });

  describe("initSessionWithJWT", () => {
    beforeEach(() => {
      req.jwt = exampleJwt;
      req.query = {
        client_id: "s6BhdRkqt3",
      };
      req.session = {
        authParams: {
          response_type: "code",
          client_id: "s6BhdRkqt3",
          state: "xyz",
          redirect_uri: "https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb",
          scope: "openid",
        },
      };

      const response = {
        data: {
          "session-id": "abc1234",
        },
      };
      req.axios.post = sinon.fake.returns(response);
    });

    it("should call axios with the correct parameters", async function () {
      await middleware.initSessionWithJWT(req, res, next);
      expect(req.axios.post).to.have.been.calledWith(
        AUTHORIZE,
        {
          request: exampleJwt,
          ...req.session.authParams,
        },
        {
          headers: {
            client_id: req.query.client_id,
          },
        }
      );
      expect((req.session.tokenId = "abc1234"));
    });

    it("should call next", async function () {
      await middleware.initSessionWithJWT(req, res, next);
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
          AUTHORIZATION_CODE,
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
          state: "abc1",
        },
      };
      req.authorization_code = "1234";

      req.axios.get = sinon.fake.returns({});
    });

    it("should successfully redirects when code is valid", async function () {
      await middleware.redirectToCallback(req, res);

      expect(res.redirect).to.have.been.calledWith(
        `https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb?code=1234&state=abc1`
      );
    });
  });

  describe("redirectToAddress", () => {
    beforeEach(() => {
      req.axios.get = sinon.fake.returns({});
    });

    it("should successfully redirect back to address", async function () {
      await middleware.redirectToAddress(req, res);

      expect(res.redirect).to.have.been.calledWith(ADDRESS);
    });
  });
});
