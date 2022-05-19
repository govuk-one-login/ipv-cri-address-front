module.exports = {
  addOAuthPropertiesToSession: ({ authParams, data } = {}) => {
    authParams.redirect_url = data.redirect_uri;
    authParams.state = data.state;

    if (!data.code) {
      const error = {
        code: "server_error",
        error_description: "Failed to retrieve authorization code",
      };

      authParams.error = error;
    } else {
      authParams.authorization_code = data.code;
    }
  },
  buildRedirectUrl: ({ authParams }) => {
    const authCode = authParams.authorization_code;
    const url = authParams.redirect_url;
    const state = authParams.state;

    let redirectUrl = new URL(url);

    if (!authCode) {
      const error = authParams.error;
      const errorCode = error?.code;
      const errorDescription = error?.description ?? error?.message;

      redirectUrl.searchParams.append("error", errorCode);
      redirectUrl.searchParams.append("error_description", errorDescription);
    } else {
      redirectUrl.searchParams.append("client_id", authParams.client_id);
      redirectUrl.searchParams.append("state", state);
      redirectUrl.searchParams.append("code", authCode);
    }

    return redirectUrl;
  },
};
