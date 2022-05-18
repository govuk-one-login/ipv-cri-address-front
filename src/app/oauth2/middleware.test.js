const middleware = require("./middleware");
const {
  API: {
    PATHS: { AUTHORIZE },
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
          client_id: "s6BhdRkqt3",
          unusedParam: "not used",
        },
        session: {},
      };
    });

    it("should save authParams to session", async function () {
      await middleware.addAuthParamsToSession(req, res, next);

      expect(req.session.authParams).to.deep.equal({
        client_id: req.query.client_id,
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
          client_id: "s6BhdRkqt3",
        },
      };

      const response = {
        data: {
          "session-id": "abc1234",
        },
      };
      req.axios.post = sinon.fake.returns(response);
    });

    context("with missing properties", () => {});

    context("on authorization request", () => {
      it("should call axios with the correct parameters", async function () {
        await middleware.initSessionWithJWT(req, res, next);
        expect(req.axios.post).to.have.been.calledWith(AUTHORIZE, {
          request: exampleJwt,
          ...req.session.authParams,
        });
        expect((req.session.tokenId = "abc1234"));
      });

      context("with API result", () => {
        it("should save 'session_id' into req.session", () => {});

        it("should call next", async function () {
          await middleware.initSessionWithJWT(req, res, next);
          expect(next).to.have.been.called;
        });
      });

      context("with API error", () => {
        it("should call next with error");
      });
    });
  });

  describe("redirectToCallback", () => {
    let redirect, state, clientId, code;

    beforeEach(() => {
      redirect = "https://client.example.com/cb";
      state = "abc1";
      clientId = "543";
      code = "123-acb-xyz";

      req.session = {
        authParams: {
          client_id: clientId,
        },
        "hmpo-wizard-address": {
          authorization_code: code,
          redirect_url: redirect,
          state,
          client_id: clientId,
        },
      };

      req.axios.get = sinon.fake.returns({});
    });

    it("should successfully redirects when code is valid", async () => {
      await middleware.redirectToCallback(req, res, next);

      expect(res.redirect).to.have.been.calledWith(
        `${redirect}?client_id=${clientId}&state=${state}&code=${code}`
      );
    });

    it("should redirects with error when error present", async () => {
      delete req.session["hmpo-wizard-address"].authorization_code;

      const errorCode = "123";
      const description = "myDescription";

      req.session["hmpo-wizard-address"].error = {
        code: errorCode,
        description: description,
      };

      await middleware.redirectToCallback(req, res, next);

      expect(res.redirect).to.have.been.calledWith(
        `${redirect}?error=${errorCode}&error_description=${description}`
      );
    });

    it("should call next with URL error if redirect_uri not present", async () => {
      delete req.session["hmpo-wizard-address"].redirect_url;

      await middleware.redirectToCallback(req, res, next);

      expect(next).to.have.been.calledWith(
        sinon.match
          .instanceOf(TypeError)
          .and(sinon.match.has("code", "ERR_INVALID_URL"))
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
