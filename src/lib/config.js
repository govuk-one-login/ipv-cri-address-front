require("dotenv").config();

module.exports = {
  API: {
    BASE_URL: process.env.API_BASE_URL || "http://localhost:5007",
    PATHS: {
      AUTHORIZE: "session",
      AUTHORIZATION_CODE: "authorization-code",
    },
  },
  APP: {
    BASE_URL: process.env.EXTERNAL_WEBSITE_HOST || "http://localhost:5010",
    PATHS: {
      ADDRESS: "/address",
    },
  },
  PORT: process.env.PORT || 5010,
  SESSION_SECRET: process.env.SESSION_SECRET,
  REDIS: {
    SESSION_URL: process.env.REDIS_SESSION_URL,
    PORT: process.env.REDIS_PORT || 6379,
  },
  ORDNANCE: {
    ORDNANCE_SURVEY_SECRET: process.env.ORDNANCE_SURVEY_SECRET,
    ORDNANCE_API_URL:
      process.env.ORDNANCE_SURVEY_URL ||
      "https://api.os.uk/search/places/v1/postcode?",
  },
};
