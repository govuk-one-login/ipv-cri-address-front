require("dotenv").config();

const GA4_CONTAINER_ID = "GTM-KD86CMZ";

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
    ANALYTICS: {
      // ID: process.env.GTM_ID,
      ID: GA4_CONTAINER_ID,
      COOKIE_DOMAIN: process.env.ANALYTICS_DOMAIN || "localhost",
    },
  },
  PORT: process.env.PORT || 5010,
  SESSION_SECRET: process.env.SESSION_SECRET,
  SESSION_TABLE_NAME: process.env.SESSION_TABLE_NAME,
  SESSION_TTL: process.env.SESSION_TTL || 7200000, // two hours in ms
  REDIS: {
    SESSION_URL: process.env.REDIS_SESSION_URL,
    PORT: process.env.REDIS_PORT || 6379,
  },
};
