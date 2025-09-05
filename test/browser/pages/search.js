module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.url = `${process.env.WEBSITE_HOST || "http://localhost:5010"}/search`;
    this.paths = ["/search", "/previous/search"];
  }

  async getPageTitle() {
    return await this.page.textContent("#header");
  }

  async getPostcode() {
    return this.page.inputValue("#addressSearch");
  }

  async searchPostcode(postcode = "TE5T1NG") {
    await this.page.fill(".govuk-input", postcode);
    await this.page.click("#continue");
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

  async drivingLicenceCalloutIsVisible() {
    return this.page.locator(".govuk-inset-text").isVisible();
  }

  async toggleLanguage(code) {
    await this.page.click(
      `[data-journey-click="link - click:lang-select:${code}"]`
    );
  }
};
