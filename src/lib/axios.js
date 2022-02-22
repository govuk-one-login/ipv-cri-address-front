const axios = require("axios");
const {
  API: { BASE_URL },
  ORDNANCE: { ORDNANCE_API_URL },
} = require("./config");

module.exports = function (req, res, next) {
  req.axios = axios.create({
    baseURL: BASE_URL,
  });

  if (req.scenarioIDHeader) {
    req.axios.defaults.headers.common["x-scenario-id"] = req.scenarioIDHeader;
  }

  // todo remove once ordnance has migrated to BE
  req.ordnanceAxios = axios.create({
    baseURL: ORDNANCE_API_URL,
  });

  if (req.scenarioIDHeader) {
    req.ordnanceAxios.defaults.headers.common["x-scenario-id"] =
      req.scenarioIDHeader;
  }

  next();
};
