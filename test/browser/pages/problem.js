module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.path = "/problem";
  }

  isCurrentPage() {
    const { pathname } = new URL(this.page.url());

    return pathname === this.path;
  }

  async chooseManualEntry() {
    await this.page.check("#addressBreak");
  }

  async chooseGoBackToSearch() {
    await this.page.check("#addressBreak-retry");
  }

  async continue() {
    await this.page.click("button");
  }
};
