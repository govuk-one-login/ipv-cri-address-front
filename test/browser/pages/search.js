module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.url = "http://localhost:5010/search";
    this.paths = ["/search", "/previous/search"];
  }

  async getPageTitle() {
    return await this.page.textContent("#header");
  }

  async searchPostcode(postcode = "TE5T1NG") {
    await this.page.fill(".govuk-input", postcode);
    await this.page.click("button");
  }

  async goto() {
    await this.page.goto(this.url); // move into a TEST_BASE_URL global const
  }

  isCurrentPage() {
    const { pathname } = new URL(this.page.url());
    return this.paths.findIndex((path) => path === pathname) !== -1;
  }

  getErrorSummary() {
    return this.page.textContent(".govuk-error-summary");
  }
};
