module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.path = "/confirm";
  }

  async changeCurrentAddress() {
    await this.page.click('[data-id="currentAddressChange"]');
  }

  async changeYearFrom() {
    await this.page.click('[data-id="yearFromChange"]');
  }

  async changePreviousAddress() {
    await this.page.click('[data-id="previousAddressChange"]');
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

  async returnCurrentAddress() {
    const currAddressResp = await this.page
      .locator(
        "#main-content > div > div > dl > div:nth-child(1) > dd.govuk-summary-list__value"
      )
      .allTextContents();
    return currAddressResp[0];
  }

  async returnYearFromValue() {
    const yearResp = await this.page
      .locator(
        "#main-content > div > div > dl > div:nth-child(2) > dd.govuk-summary-list__value"
      )
      .allTextContents();
    return yearResp[0];
  }

  async returnPreviousAddressValue() {
    const yearResp = await this.page
      .locator(
        "#main-content > div > div > dl > div:nth-child(3) > dd.govuk-summary-list__value"
      )
      .allTextContents();
    return yearResp[0];
  }
};
