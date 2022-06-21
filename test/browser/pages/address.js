module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.paths = [
      "/address",
      "/address/edit",
      "/previous/address",
      "/previous/address/edit",
    ];
  }

  async continue() {
    await this.page.click("#continue");
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async getPageTitle() {
    return await this.page.textContent("#header");
  }

  isCurrentPage() {
    const { pathname } = new URL(this.page.url());

    return this.paths.findIndex((val) => val === pathname) !== -1;
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
    if (value === "current") {
      value = new Date().getFullYear();
    } else if (value === "future") {
      value = new Date().getFullYear() + 1;
    }
    await this.page.fill("#addressYearFrom", `${value}`);
  }

  getHouseNumber() {
    return this.page.inputValue("#addressHouseNumber");
  }

  getFlatNumber() {
    return this.page.inputValue("#addressFlatNumber");
  }

  getStreet() {
    return this.page.inputValue("#addressStreetName");
  }

  getHouseName() {
    return this.page.inputValue("#addressHouseName");
  }

  getTownOrCity() {
    return this.page.inputValue("#addressLocality");
  }

  getYearFrom() {
    return this.page.inputValue("#addressYearFrom");
  }

  getErrorSummary() {
    return this.page.textContent(".govuk-error-summary");
  }

  getPostcode() {
    return this.page.textContent('[data-id="changePostcodeValue"]');
  }
};
