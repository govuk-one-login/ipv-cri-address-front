module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.path = "/address";
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
    const { pathname } = new URL(this.page.url());

    return pathname === this.path;
  }
  async addHouseNumber(value = "1A") {
    await this.page.fill("#addressHouseNumber", value);
  }

  async addFlatNumber(value = "1A") {
    await this.page.fill("#addressFlatNumber", value);
  }

  async addHouseName(value = "myHouse") {
    await this.page.fill("#addressHouseName", value);
  }

  async addStreet(value = "test") {
    await this.page.fill("#addressStreetName", value);
  }

  async addTownOrCity(value = "testTown") {
    await this.page.fill("#addressLocality", value);
  }

  async addYearFrom(value) {
    if (value === "") {
      value = new Date().getFullYear();
    }
    await this.page.fill("#addressYearFrom", `${value}`);
  }
};
