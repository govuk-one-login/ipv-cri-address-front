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

  describe("redirectToCallback", () => {
    let redirect, state, clientId, code;

    beforeEach(() => {
      redirect = "https://client.example.com/cb";
      state = "abc1";
      clientId = "543";
      code = "123-acb-xyz";

      req.session = {
        authParams: {
          redirect_uri: redirect,
          state,
          client_id: clientId,
        },
        "hmpo-wizard-address": {
          authorization_code: code,
        },
      };

      req.axios.get = sinon.fake.returns({});
    });

    it("should successfully redirects when code is valid", async () => {
      await middleware.redirectToCallback(req, res, next);

      res.on("end", () => {
        expect(res.redirect).to.have.been.calledWith(
          `${redirect}?client_id=${clientId}&state=${state}&code=${code}`
        );
      });
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

      res.on("end", () => {
        expect(res.redirect).to.have.been.calledWith(
          `${redirect}?error=${errorCode}&error_description=${description}`
        );
      });
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
