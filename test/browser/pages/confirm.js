module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.path = "/summary/confirm";
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

  async selectNoRadioButton() {
    await this.page
      .locator("#isAddressMoreThanThreeMonths-lessThanThreeMonths")
      .click();
  }

  async returnRadioLegend() {
    return this.page.textContent(
      "#isAddressMoreThanThreeMonths-fieldset > legend",
    );
  }

  isAddressRadioButtonPresent() {
    return this.page.locator("#isAddressMoreThanThreeMonths").isVisible();
  }

  async selectYesRadioButton() {
    await this.page.locator("#isAddressMoreThanThreeMonths").click();
  }

  isCurrentPage() {
    const { pathname } = new URL(this.page.url());
    return pathname === this.path;
  }

  returnCurrentAddress() {
    return this.page.innerHTML(
      "#main-content > div > div > dl > div:nth-child(1) > dd.govuk-summary-list__value",
    );
  }

  returnYearFromValue() {
    return this.page.textContent(
      "#main-content > div > div > dl > div:nth-child(2) > dd.govuk-summary-list__value",
    );
  }

  returnPreviousAddressValue() {
    return this.page.textContent(
      "#main-content > div > div > dl > div:nth-child(3) > dd.govuk-summary-list__value",
    );
  }

  getErrorSummary() {
    return this.page.textContent(".govuk-error-summary");
  }
};
