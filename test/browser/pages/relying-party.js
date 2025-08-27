module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async goto(clientId = "standalone") {
    const baseUrl = process.env.WEBSITE_HOST || "http://localhost:5010";
    this.startingUrl = `${baseUrl}/oauth2/authorize?request=lorem&client_id=${clientId}`;

    await this.page.goto(this.startingUrl);
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
    const mockApiUrl = process.env.MOCK_API_URL || "http://localhost:8080";
    return new URL(this.page.url()).origin === mockApiUrl;
  }

  hasSuccessQueryParams(clientId = "standalone") {
    const { searchParams } = new URL(this.page.url());

    return (
      searchParams.get("client_id") === clientId &&
      searchParams.get("state") === "sT@t3" &&
      searchParams.get("code") === "FACEFEED"
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
