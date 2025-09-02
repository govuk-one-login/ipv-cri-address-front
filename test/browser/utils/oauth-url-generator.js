const configureAxios = require("./aws-sig4-requester");
const http = configureAxios();

class OAuthUrlGenerator {
  constructor(options = {}) {
    this.environment = options.environment;
    this.websiteHost = options.websiteHost;
    this.relyingPartyUrl = options.relyingPartyUrl;
  }

  getMockOAuthUrl(clientId = "standalone", request = "lorem") {
    return `${this.websiteHost}/oauth2/authorize?client_id=${clientId}&request=${request}`;
  }

  async getStubOAuthUrl(sharedClaims = null) {
    const startUrl = new URL("start", this.relyingPartyUrl);
    const payload = {
      // needs to be domain with .well-known endpoint,
      aud: `https://review-a.${this.environment}.account.gov.uk`,
      ...(sharedClaims ? { shared_claims: sharedClaims } : {}),
    };

    try {
      const { data } = await http.post(startUrl, payload);

      const { client_id, request } = data;
      if (!client_id || !request) {
        throw new Error(`Invalid stub response: ${JSON.stringify(data)}`);
      }

      return this.getMockOAuthUrl(client_id, request);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to fetch stub OAuth URL", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        url: startUrl,
      });
      throw err;
    }
  }

  async getOAuthUrl(clientId = "standalone", sharedClaims = null) {
    const useMock = process.env.MOCK_API !== "false";
    if (useMock) {
      return this.getMockOAuthUrl(clientId);
    }

    try {
      return await this.getStubOAuthUrl(sharedClaims);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Stub API failed, falling back to mock URL:", error.message);
      return this.getMockOAuthUrl(clientId);
    }
  }
}

module.exports = OAuthUrlGenerator;
