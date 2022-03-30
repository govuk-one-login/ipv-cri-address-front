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

  async confirmDetails() {
    await this.page.click('[data-id="next"]');
  }

  async previousAddressButton() {
    await this.page.locator("id=addPreviousAddresses").click();
  }

  isCurrentPage() {
    return this.page.url() === this.url;
  }
};
