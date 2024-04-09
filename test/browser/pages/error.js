module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  getErrorTitle() {
    return this.page.textContent('[data-id="error-title"]');
  }

  getSomethingWentWrongMessage() {
    return "Sorry, there is a problem with the service";
  }

  isCurrentPage() {
    return this.page.url() === this.url;
  }
};
