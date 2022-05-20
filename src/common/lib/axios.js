const axios = require("axios");

module.exports = function (req, res, next) {
  const baseURL = req.app.get("API.BASE_URL");

  if (!baseURL) {
    next(new Error("Missing API.BASE_URL value"));
  }

  req.axios = axios.create({
    baseURL,
  });

  if (req.scenarioIDHeader && req.axios?.defaults?.headers?.common) {
    req.axios.defaults.headers.common["x-scenario-id"] = req.scenarioIDHeader;
  }

  next();
};
