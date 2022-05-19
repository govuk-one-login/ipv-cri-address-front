module.exports = {
  setAPIConfig: ({ app, baseUrl, authorizePath }) => {
    app.set("API.BASE_URL", baseUrl);
    app.set("API.PATHS.AUTHORIZE", authorizePath);
  },

  setOAuthPaths: ({ app, entryPointPath }) => {
    app.set("APP.PATHS.ENTRYPOINT", entryPointPath);
  },
};
