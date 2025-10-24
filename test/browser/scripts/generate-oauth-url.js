#!/usr/bin/env node

// eslint-disable-next-line no-console
console.log("SCRIPT IS RUNNING");

const OAuthUrlGenerator = require("../utils/oauth-url-generator");

const generateOAuthUrl = async () => {
  const environment = process.env.ENVIRONMENT || "dev";
  // eslint-disable-next-line no-console
  console.log("=== SCRIPT STARTING ===");
  // eslint-disable-next-line no-console
  console.log("=== ENVIRONMENT VARIABLES ===");
  // eslint-disable-next-line no-console
  console.log(`TOKEN_ENDPOINT: ${process.env.TOKEN_ENDPOINT || "UNDEFINED"}`);
  // eslint-disable-next-line no-console
  console.log(
    `CREDENTIAL_ENDPOINT: ${process.env.CREDENTIAL_ENDPOINT || "UNDEFINED"}`
  );
  // eslint-disable-next-line no-console
  console.log("=== END ENVIRONMENT VARIABLES ===");

  // eslint-disable-next-line no-console
  console.log("Creating OAuthUrlGenerator...");
  const oauthGenerator = new OAuthUrlGenerator({
    environment,
    websiteHost: process.env.WEBSITE_HOST || "http://localhost:5010",
    relyingPartyUrl: process.env.RELYING_PARTY_URL || "http://localhost:8080",
    tokenEndpoint: process.env.TOKEN_ENDPOINT,
    credentialEndpoint: process.env.CREDENTIAL_ENDPOINT,
  });
  // eslint-disable-next-line no-console
  console.log("OAuthUrlGenerator created successfully");
  // eslint-disable-next-line no-console
  console.log(`oauthGenerator: ${JSON.stringify(oauthGenerator)}`);
  // eslint-disable-next-line no-console
  console.log("About to generate OAuth URL...");
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
