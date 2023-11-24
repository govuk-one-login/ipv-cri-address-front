module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page, clientId) {
    this.page = page;
    this.clientId = clientId;

    // Starting URL properties
    const websiteHost = process.env.WEBSITE_HOST || "http://localhost:5050";
    this.baseURL = new URL(websiteHost);

    this.oauthPath = `/oauth2/authorize?request=lorem&client_id=${this.clientId}`;
    this.startingURL = new URL(this.oauthPath, this.baseURL);

    // Relying Party Return URL
    this.relyingPartyURL = new URL(
      process.env.API_HOST || "http://localhost:8080"
    );
  }

  async goto() {
    await this.page.goto(this.startingURL.toString());
  }

  // async isRedirectPage() {
  //   const url = this.page.url();
  //
  //   const isCorrectPage =
  //     url.startsWith(this.relyingPartyURL) &&
  //     url.endsWith("client_id=standalone&state=sT%40t3&code=FACEFEED");
  //
  //   return isCorrectPage;
  // }

  isRelyingPartyServer() {
    const { origin } = new URL(this.page.url());

    return origin === this.relyingPartyURL.origin;
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

    console.log(searchParams);
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
