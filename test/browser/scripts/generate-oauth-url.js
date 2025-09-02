#!/usr/bin/env node

const OAuthUrlGenerator = require("../utils/oauth-url-generator");

const generateOAuthUrl = async () => {
  const environment = process.env.ENVIRONMENT || "dev";

  const oauthGenerator = new OAuthUrlGenerator({
    environment,
    websiteHost: process.env.WEBSITE_HOST || "http://localhost:5010",
    relyingPartyUrl: process.env.RELYING_PARTY_URL || "http://localhost:8080",
  });

  try {
    // eslint-disable-next-line no-console
    console.log(await oauthGenerator.getOAuthUrl("standalone"));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error generating OAuth URL:", error);
    process.exit(1);
  }
};

generateOAuthUrl();
