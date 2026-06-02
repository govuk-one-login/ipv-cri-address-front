export function setAPIConfig({ app, baseUrl, sessionPath, authorizationPath }) {
  app.set("API.BASE_URL", baseUrl);
  app.set("API.PATHS.SESSION", sessionPath);
  app.set("API.PATHS.AUTHORIZATION", authorizationPath);
}

export function setOAuthPaths({ app, entryPointPath }) {
  app.set("APP.PATHS.ENTRYPOINT", entryPointPath);
}
