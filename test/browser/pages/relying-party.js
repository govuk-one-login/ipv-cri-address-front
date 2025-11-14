const OAuthUrlGenerator = require("../utils/oauth-url-generator");

module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    const websiteHost = process.env.WEBSITE_HOST || "http://localhost:5010";
    const relyingPartyURL =
      process.env.RELYING_PARTY_URL || "http://localhost:8080";

    this.page = page;
    this.baseURL = new URL(websiteHost);
    this.relyingPartyURL = new URL(relyingPartyURL);

    this.oauthGenerator = new OAuthUrlGenerator({
      environment: process.env.ENVIRONMENT || "dev",
      websiteHost,
      relyingPartyUrl: relyingPartyURL,
    });
  }

  async goto(clientId = "standalone", sharedClaims) {
    const oauthUrl = await this.oauthGenerator.getOAuthUrl(
      clientId,
      sharedClaims
    );
    this.startingURL = new URL(oauthUrl);
    await this.page.goto(this.startingURL.href);
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
