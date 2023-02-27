module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.paths = ["/current/problem", "/previous/problem"];
  }

  isCurrentPage() {
    const { pathname } = new URL(this.page.url());
    return this.paths.findIndex((path) => path === pathname) !== -1;
  }

  async chooseManualEntry() {
    await this.page.check("#addressBreak");
  }

  async chooseGoBackToSearch() {
    await this.page.check("#addressBreak-retry");
  }

  async continue() {
    await this.page.click("#continue");
  }
};
