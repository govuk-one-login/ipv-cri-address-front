module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.paths = ["/results", "/previous/results"];
  }

  isCurrentPage() {
    const { pathname } = new URL(this.page.url());
    return this.paths.findIndex((path) => path === pathname) !== -1;
  }

  async selectAddress(value = "10 WHITECHAPEL HIGH STREET, LONDON, E1 8QS") {
    await this.page.click(".govuk-select");
    await this.page.selectOption(".govuk-select", {
      value,
    });
  }

  getPostcode() {
    return this.page.textContent('[data-id="changePostcodeValue"]');
  }

  async selectCantFindMyAddress() {
    await this.page.click('[data-id="cantFindAddress"]');
  }

  async selectChangePostcode() {
    await this.page.click('[data-id="changePostcode"]');
  }

  async getPageTitle() {
    return await this.page.textContent("#header");
  }

  async continue() {
    await this.page.click("button");
  }
};
