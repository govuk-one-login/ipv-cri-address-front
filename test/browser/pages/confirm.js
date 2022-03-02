module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.url = "http://localhost:5010/confirm";
  }

  async changeAddress() {
    await this.page.click("#change-address");
  }

  // TODO change selector to data-id
  async confirmDetails() {
    await this.page.locator(":nth-match(.govuk-button, 2)");
  }

  async previousAddressButton() {
    await this.page.locator("id=addPreviousAddresses").click();
  }

  isCurrentPage() {
    return this.page.url() === this.url;
  }
};
