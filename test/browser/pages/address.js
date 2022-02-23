module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async continue() {
    await this.page.click(".govuk-button");
  }

  async goto() {
    await this.page.goto("http://localhost:5010/address");
  }

  async getPageTitle() {
    return await this.page.textContent("#header");
  }
};
