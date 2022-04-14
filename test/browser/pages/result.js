module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.path = "/results";
  }

  isCurrentPage() {
    const { pathname } = new URL(this.page.url());

    return pathname === this.path;
  }

  async selectAddress(value = "10 WHITECHAPEL HIGH STREET, LONDON, E1 8QS") {
    await this.page.click(".govuk-select");
    await this.page.selectOption(".govuk-select", {
      value,
    });
  }

  async getPageTitle() {
    return await this.page.textContent("#header");
  }

  async continue() {
    await this.page.click("button");
  }
};
