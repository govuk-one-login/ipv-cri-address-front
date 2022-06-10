module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.path = "/confirm";
  }

  async changeAddress() {
    await this.page.click("#change-address");
  }

  async confirmDetails() {
    await this.page.click('[data-id="next"]');
  }

  async isRadioSelectorVisible() {
    return await this.page.isVisible('[data-id="getPreviousAddressRadios"]');
  }
  async selectNoRadioButton() {
    await this.page
      .locator("id=isAddressMoreThanThreeMonths-lessThanThreeMonths")
      .click();
  }

  async selectYesRadioButton() {
    await this.page.locator("id=isAddressMoreThanThreeMonths").click();
  }

  isCurrentPage() {
    const { pathname } = new URL(this.page.url());
    return pathname === this.path;
  }
};
