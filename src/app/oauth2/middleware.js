const {
  API: {
    PATHS: { AUTHORIZE },
  },
  APP: {
    PATHS: { ADDRESS },
  },
} = require("../../lib/config");

module.exports = {
  addAuthParamsToSession: async (req, res, next) => {
    const authParams = {
      response_type: req.query.response_type,
      client_id: req.query.client_id,
      state: req.query.state,
      redirect_uri: req.query.redirect_uri,
    };

    req.session.authParams = authParams;

    next();
  },

  addJWTToRequest: (req, res, next) => {
    req.jwt = req.query?.request;
    next();
  },

  initSessionWithJWT: async (req, res, next) => {
    const requestJWT = req.jwt;
    const headers = { client_id: req.query?.client_id };

    try {
      if (requestJWT) {
        const apiResponse = await req.axios.post(
          AUTHORIZE,
          {
            request: req.jwt,
            ...req.session.authParams,
          },
          {
            headers: headers,
          }
        );
        req.session.tokenId = apiResponse?.data["session_id"];
      }
    } catch (error) {
      next(error);
    }
    next();
  },

  redirectToCallback: async (req, res, next) => {
    try {
      const authCode = req.session["hmpo-wizard-address"].authorization_code;

      const url = new URL(req.session.authParams.redirect_uri);

      if (!authCode) {
        const error = req.session["hmpo-wizard-address"].error;
        const errorCode = error?.code;
        const errorDescription = error?.description ?? error?.message;

        url.searchParams.append("error", errorCode);
        url.searchParams.append("error_description", errorDescription);
      } else {
        url.searchParams.append("client_id", req.session.authParams.client_id);
        url.searchParams.append("state", req.session.authParams.state);
        url.searchParams.append("code", authCode);
      }
      res.redirect(url.toString());
    } catch (e) {
      next(e);
    }
  },

  redirectToAddress: async (req, res) => {
    res.redirect(ADDRESS);
  },
};
