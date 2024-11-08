module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.paths = ["/enter-non-UK-address"];
  }

  isCurrentPage() {
    const { pathname } = new URL(this.page.url());

    return this.paths.findIndex((val) => val === pathname) !== -1;
  }
};
