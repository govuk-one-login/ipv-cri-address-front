module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  getErrorTitle() {
    return this.page.textContent('[data-page="errors.error"]');
  }

  getSomethingWentWrongMessage() {
    return "Something went wrong!";
  }

  isCurrentPage() {
    return this.page.url() === this.url;
  }
};
