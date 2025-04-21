module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.paths = ["/what-country"];
  }

  async continue() {
    await this.page.click("#continue");
  }

  isCurrentPage() {
    const { pathname } = new URL(this.page.url());

    return this.paths.findIndex((val) => val === pathname) !== -1;
  }

  async selectCountry(value) {
    // The country selector is not a select component when javascript is enabled
    const input = this.page.locator("#country");
    input.fill(value);
    await this.page.click("#country__option--0");
  }

  async getSelectedCountry() {
    const select = this.page.locator("select");
    const text = await select.locator("option:checked").textContent();

    return text.trim();
  }

  getErrorSummary() {
    return this.page.textContent(".govuk-error-summary");
  }
};
