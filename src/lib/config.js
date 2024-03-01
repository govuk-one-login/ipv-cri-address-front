require("dotenv").config();

module.exports = {
  API: {
    BASE_URL: process.env.API_BASE_URL || "http://localhost:5007/",
    PATHS: {
      SESSION: "session",
      AUTHORIZATION: "authorization",
      POSTCODE_LOOKUP: "postcode-lookup",
      SAVE_ADDRESS: "address",
      GET_ADDRESSES: "addresses",
    },
  },
  APP: {
    BASE_URL: process.env.EXTERNAL_WEBSITE_HOST || "http://localhost:5010",
    PATHS: {
      ADDRESS: "/",
    },
    GTM: {
      ANALYTICS_COOKIE_DOMAIN:
        process.env.ANALYTICS_COOKIE_DOMAIN || "localhost",
      UA_DISABLED: process.env.UA_DISABLED || "false", // TODO: Change to 'true' after data analyst QA
      UA_CONTAINER_ID: process.env.UA_CONTAINER_ID,
      GA4_DISABLED: process.env.GA4_DISABLED || "true", // TODO: Change to 'false' after data analyst QA
      GA4_CONTAINER_ID: process.env.GA4_CONTAINER_ID,
    },
  },
  LOG_LEVEL: process.env.LOG_LEVEL || "request",
  PORT: process.env.PORT || 5010,
  SESSION_SECRET: process.env.SESSION_SECRET,
  SESSION_TABLE_NAME: process.env.SESSION_TABLE_NAME,
  SESSION_TTL: process.env.SESSION_TTL || 7200000, // two hours in ms
  REDIS: {
    SESSION_URL: process.env.REDIS_SESSION_URL,
    PORT: process.env.REDIS_PORT || 6379,
  },
};
