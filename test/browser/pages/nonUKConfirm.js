module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.path = "/summary/non-UK-confirm";
  }

  isCurrentPage() {
    const { pathname } = new URL(this.page.url());
    return pathname === this.path;
  }

  returnCurrentAddress() {
    return this.page.innerHTML(
      "#main-content > div > div > dl > div:nth-child(1) > dd.govuk-summary-list__value"
    );
  }

  returnYearFromValue() {
    return this.page.textContent(
      "#main-content > div > div > dl > div:nth-child(2) > dd.govuk-summary-list__value"
    );
  }

  isAddressRadioButtonPresent() {
    return this.page
      .locator("#hasPreviousUKAddressWithinThreeMonths")
      .isVisible();
  }

  isPreviousAddressRowPresent() {
    return this.page
      .locator(
        "#main-content > div > div > dl > div:nth-child(3) > dd.govuk-summary-list__value"
      )
      .isVisible();
  }

  async changeCurrentAddress() {
    await this.page.click('[data-id="currentAddressChange"]');
  }

  async changeYearFrom() {
    await this.page.click('[data-id="yearFromChange"]');
  }

  async clickBackOnPage() {
    await this.page.click('[id="back"]');
  }

  async confirmDetails() {
    await this.page.click('[data-id="next"]');
  }
};
