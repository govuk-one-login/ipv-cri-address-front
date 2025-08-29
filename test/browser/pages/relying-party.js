const axios = require("axios");
const { fromNodeProviderChain } = require("@aws-sdk/credential-providers");
const { aws4Interceptor } = require("aws4-axios");

const customCredentialsProvider = {
  getCredentials: fromNodeProviderChain({
    timeout: 1000,
    maxRetries: 0,
  }),
};
const interceptor = aws4Interceptor({
  options: {
    region: "eu-west-2",
    service: "execute-api",
  },
  credentials: customCredentialsProvider,
});

axios.interceptors.request.use(interceptor);

module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page, clientId) {
    this.page = page;

    const websiteHost = process.env.WEBSITE_HOST || "http://localhost:5010";
    const relyingPartyURL =
      process.env.RELYING_PARTY_URL || "http://localhost:8080";
    this.baseURL = new URL(websiteHost);
    this.relyingPartyURL = new URL(relyingPartyURL);
    this.env = process.env.ENVIRONMENT || "dev";

    if (process.env.MOCK_API !== "false") {
      this.oauthPath = this.getOauthPath("lorem", clientId);
      this.startingURL = new URL(this.oauthPath, this.baseURL);
    }
  }

  async goto(clientId = "standalone", sharedClaims) {
    if (process.env.MOCK_API === "false") {
      this.startingURL = await this.getStartingURLForStub(sharedClaims);
    } else {
      const baseUrl = process.env.WEBSITE_HOST || "http://localhost:5010";
      this.startingUrl = `${baseUrl}/oauth2/authorize?request=lorem&client_id=${clientId}`;
      this.startingURL = new URL(this.startingUrl);
    }

    await this.page.goto(this.startingURL.toString());
  }

  getOauthPath(request, clientId) {
    return `/oauth2/authorize?request=${request}&client_id=${clientId}`;
  }

  async getStartingURLForStub(sharedClaims) {
    try {
      const startUrl = new URL("start", process.env.RELYING_PARTY_URL);
      const response = await axios.post(startUrl, {
        aud: process.env.WEBSITE_HOST,
        ...(sharedClaims && { shared_claims: sharedClaims }),
      });

      this.oauthPath = this.getOauthPath(
        response.data.request,
        response.data.client_id
      );

      return new URL(this.oauthPath, this.baseURL);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }

  async isRedirectPage(clientId = "standalone") {
    const url = this.page.url();
    const mockApiUrl = process.env.MOCK_API_URL || "http://localhost:8080";

    const isCorrectPage =
      url.startsWith(mockApiUrl) &&
      url.endsWith(`client_id=${clientId}&state=sT%40t3&code=FACEFEED`);

    return isCorrectPage;
  }

  isRelyingPartyServer() {
    const origin = new URL(this.page.url()).origin;

    if (process.env.MOCK_API === "false") {
      return origin === this.relyingPartyURL.origin;
    }

    const mockApiUrl = process.env.MOCK_API_URL || "http://localhost:8080";
    return origin === mockApiUrl;
  }

  hasSuccessQueryParams(clientId = "standalone") {
    const params = new URL(this.page.url()).searchParams;

    if (process.env.MOCK_API === "false") {
      return ["client_id", "state", "code"].every((key) => !!params.get(key));
    }

    return (
      params.get("client_id") === clientId &&
      params.get("state") === "sT@t3" &&
      params.get("code") === "FACEFEED"
    );
  }

  hasErrorQueryParams(code) {
    const { searchParams } = new URL(this.page.url());
    return (
      searchParams.get("error") === "server_error" &&
      searchParams.get("error_description") === code
    );
  }

  isErrorCode(code) {
    const { searchParams } = new URL(this.page.url());

    return searchParams.get("error") && searchParams.get("error") === code;
  }
};
