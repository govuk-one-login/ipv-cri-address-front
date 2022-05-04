module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.url = process.env.CORE_STUB_URL || "http://localhost:8085";
  }

  isCurrentPage() {
    return this.page.url() === this.url;
  }

  async chooseCredentialIssuer() {
    // Home
    await this.page.goto(this.url);

    await Promise.all([
      this.page.waitForNavigation(),
      this.page.click("button"),
    ]);

    // Credential Issuers
    await this.page
      .locator(`input[value='${process.env.CREDENTIAL_ISSUER_LABEL}']`)
      .click();
  }
};
