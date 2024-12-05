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
    const select = this.page.locator("select");
    select.selectOption({ label: value });
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
