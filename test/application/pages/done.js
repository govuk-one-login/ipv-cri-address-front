module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.url = "http://localhost:5010/done";
  }

  isCurrentPage() {
    return this.page.url() === this.url;
  }
};
