#!/usr/bin/env node

const StubOAuthUrlGenerator = require("../utils/stub-oauth-url-generator");

const generateOAuthUrl = async () => {
  const environment = process.env.ENVIRONMENT || "dev";

  const oauthGenerator = new StubOAuthUrlGenerator({
    environment,
    websiteHost: process.env.WEBSITE_HOST || "http://localhost:5010",
    relyingPartyUrl: process.env.RELYING_PARTY_URL || "http://localhost:8080",
    tokenEndpoint: process.env.TOKEN_ENDPOINT,
    credentialEndpoint: process.env.CREDENTIAL_ENDPOINT,
  });

  try {
    const url = await oauthGenerator.getOAuthUrl("standalone");
    // eslint-disable-next-line no-console
    console.log(`oauth2: ${url}`);
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error generating OAuth URL:", error);
    process.exit(1);
  }
};

generateOAuthUrl();
