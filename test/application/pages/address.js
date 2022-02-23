module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.url = "http://localhost:5010/address";
  }

  async continue() {
    await this.page.click(".govuk-button");
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async getPageTitle() {
    return await this.page.textContent("#header");
  }

  isCurrentPage() {
    return this.page.url() === this.url;
  }

  async addHouseNameOrNumber(value = "1A") {
    await this.page.fill("#addressLine1", value);
  }

  async addStreet(value = "test") {
    await this.page.fill("#addressLine2", value);
  }

  async addTownOrCity(value = "testTown") {
    await this.page.fill("#addressTown", value);
  }
};
