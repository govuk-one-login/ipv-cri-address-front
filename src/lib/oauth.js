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
};
