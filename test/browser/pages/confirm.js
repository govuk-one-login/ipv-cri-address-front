module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.path = "/confirm";
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
    const { pathname } = new URL(this.page.url());

    return pathname === this.path;
  }
};
