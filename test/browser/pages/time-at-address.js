module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.paths = ["/time-at-address"];
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

  async addYearFrom(value) {
    if (value === "current") {
      value = new Date().getFullYear();
    } else if (value === "future") {
      value = new Date().getFullYear() + 1;
    }
    await this.page.fill("#addressYearFrom", `${value}`);
  }

  getYearFrom() {
    return this.page.inputValue("#addressYearFrom");
  }

  getErrorSummary() {
    return this.page.textContent(".govuk-error-summary");
  }
};
