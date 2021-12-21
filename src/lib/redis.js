const cfenv = require("cfenv");
const appEnv = cfenv.getAppEnv();
const {
  REDIS: { SESSION_URL, PORT },
} = require("../lib/config");

module.exports = () => {
  const cfRedisUrl = appEnv.getServiceURL("session-cache");
  if (cfRedisUrl) {
    return {
      connectionString: cfRedisUrl,
    };
  }

  if (!SESSION_URL) {
    return {};
  }

  const host = SESSION_URL;
  const port = PORT;
  const scheme = "redis";

  return {
    connectionString: `${scheme}://${host}:${port}`,
    retry_strategy: function (options) {
      if (options.total_retry_time > 1000 * 60 * 60) {
        return new Error("Retry time exhausted");
      }
      if (options.attempt > 10) {
        return new Error("Attempts exhausted");
      }

      return Math.min(options.attempt * 100, 3000);
    },
  };
};
