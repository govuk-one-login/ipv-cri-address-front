const axios = require("axios");
const {
  API: { BASE_URL },
} = require("./config");

module.exports = function (req, res, next) {
  req.axios = axios.create({
    baseURL: BASE_URL,
  });

  if (req.scenarioIDHeader) {
    req.axios.defaults.headers.common["x-scenario-id"] = req.scenarioIDHeader;
  }

  next();
};
