module.exports = {
  addOAuthPropertiesToSessionModel: ({ sessionModel, data } = {}) => {
    sessionModel.set("redirect_url", data.redirect_uri);
    sessionModel.set("state", data.state);

    if (!data.code) {
      const error = {
        code: "server_error",
        error_description: "Failed to retrieve authorization code",
      };

      sessionModel.set("error", error);
    } else {
      sessionModel.set("authorization_code", data.code);
    }
  },
  buildRedirectUrl: ({ sessionModel, authParams }) => {
    const authCode = sessionModel.authorization_code;
    const url = sessionModel.redirect_url;
    const state = sessionModel.state;

    let redirectUrl = new URL(url);

    if (!authCode) {
      const error = sessionModel.error;
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
