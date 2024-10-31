require("dotenv").config();

module.exports = {
  API: {
    BASE_URL: process.env.API_BASE_URL || "http://localhost:5007",
    PATHS: {
      SESSION: "/session",
      AUTHORIZATION: "/authorization",
      POSTCODE_LOOKUP: "/postcode-lookup",
      SAVE_ADDRESS: "/address",
      GET_ADDRESSES: "/addresses/v2",
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
      UA_ENABLED: process.env.UA_ENABLED || "false",
      UA_CONTAINER_ID: process.env.UA_CONTAINER_ID,
      GA4_ENABLED: process.env.GA4_ENABLED || "false",
      GA4_CONTAINER_ID: process.env.GA4_CONTAINER_ID,
    },
    LANGUAGE_TOGGLE_DISABLED: process.env.LANGUAGE_TOGGLE_DISABLED || "true",
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
