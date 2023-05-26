module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page, clientId) {
    this.page = page;
    this.clientId = clientId;
  }

  async goto() {
    const websiteHost = process.env.WEBSITE_HOST || "http://localhost:5010";
    this.startingUrl = `${websiteHost}/oauth2/authorize?request=lorem&client_id=${this.clientId}`;

    await this.page.goto(this.startingUrl);
  }

  async isRedirectPage() {
    const url = this.page.url();

    const isCorrectPage =
      url.startsWith("http://example.net") &&
      url.endsWith("client_id=standalone&state=sT%40t3&code=FACEFEED");

    return isCorrectPage;
  }

  isRelyingPartyServer() {
    return new URL(this.page.url()).origin === "http://example.net";
  }

  hasSuccessQueryParams() {
    const { searchParams } = new URL(this.page.url());

    return (
      searchParams.has("client_id") && // FIXME: Restore checking of client_id
      searchParams.get("state") === "sT@t3" &&
      searchParams.get("code").startsWith("auth-code-")
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
