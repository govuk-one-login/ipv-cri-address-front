const BaseOAuthUrlGenerator = require("./base-oauth-url-generator");

class StubOAuthUrlGenerator extends BaseOAuthUrlGenerator {
  constructor(options = {}) {
    super(options);
    this.tokenEndpoint = options.tokenEndpoint;
    this.credentialEndpoint = options.credentialEndpoint;
  }

  createState(audience) {
    const statePayload = {
      aud: audience,
      redirect_uri: `${this.websiteHost}/oauth2/callback`,
    };
    if (this.tokenEndpoint) {
      statePayload.token_endpoint = this.tokenEndpoint;
    }
    if (this.credentialEndpoint) {
      statePayload.credential_endpoint = this.credentialEndpoint;
    }
    return this.base64Encode(JSON.stringify(statePayload));
  }
}

module.exports = StubOAuthUrlGenerator;
