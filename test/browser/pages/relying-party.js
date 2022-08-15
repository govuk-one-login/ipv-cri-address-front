module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async goto() {
    this.startingUrl =
      "http://localhost:5010/oauth2/authorize?request=lorem&client_id=standalone";

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
      searchParams.get("client_id") === "standalone" &&
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
