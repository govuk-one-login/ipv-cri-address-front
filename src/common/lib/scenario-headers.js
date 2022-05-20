module.exports = function (req, res, next) {
  if (process.env.NODE_ENV === "development") {
    req.scenarioIDHeader = req.headers["x-scenario-id"];
  }

  next();
};
