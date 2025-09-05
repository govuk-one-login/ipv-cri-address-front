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

  async addApartmentNumber(value = "1A") {
    await this.page.fill("#nonUKAddressApartmentNumber", value);
  }

  async addBuildingNumber(value = "1A") {
    await this.page.fill("#nonUKAddressBuildingNumber", value);
  }

  async addBuildingName(value = "My Building Name") {
    await this.page.fill("#nonUKAddressBuildingName", value);
  }

  async addStreet(value = "test") {
    await this.page.fill("#nonUKAddressStreetName", value);
  }

  async addTownOrCity(value = "testTown") {
    await this.page.fill("#nonUKAddressLocality", value);
  }

  async addRegion(value = "testTown") {
    await this.page.fill("#nonUKAddressRegion", value);
  }

  async addAddressPostalCode(value = "post code") {
    await this.page.fill("#nonUKAddressPostalCode", value);
  }

  async addYearFrom(value) {
    const yearInputSelector = "#nonUKAddressYearFrom";
    await this.page.waitForSelector(yearInputSelector, { state: "visible" });

    if (value === "") {
      await this.page.fill(yearInputSelector, value);
    } else {
      value = this.getYear(value);
      await this.page.fill(yearInputSelector, `${value}`);
    }
  }

  getYear(year) {
    if (year === "recent") {
      return new Date().getFullYear();
    } else if (year === "future") {
      return new Date().getFullYear() + 1;
    } else if (year === "older") {
      return new Date().getFullYear() - 2;
    }
    return year;
  }

  async continue() {
    await this.page.click("#continue");
  }

  async change() {
    await this.page.click("[data-id='changeCountry']");
  }

  getChangeAddressValue() {
    return this.page.textContent("[data-id='changeCountryValue']");
  }

  getApartmentNumber() {
    return this.page.inputValue("#nonUKAddressApartmentNumber");
  }

  getBuildingNumber() {
    return this.page.inputValue("#nonUKAddressBuildingNumber");
  }

  getBuildingName() {
    return this.page.inputValue("#nonUKAddressBuildingName");
  }

  getStreet() {
    return this.page.inputValue("#nonUKAddressStreetName");
  }

  getTownOrCity() {
    return this.page.inputValue("#nonUKAddressLocality");
  }

  getRegion() {
    return this.page.inputValue("#nonUKAddressRegion");
  }

  getAddressPostalCode() {
    return this.page.inputValue("#nonUKAddressPostalCode");
  }

  getYearFrom() {
    return this.page.inputValue("#nonUKAddressYearFrom");
  }

  async getErrorSummary() {
    return await this.page.textContent(".govuk-error-summary");
  }

  async getErrorBuildingAddress() {
    const buildAddressError = await this.page.textContent(
      "#buildingAddress-error"
    );
    const apartmentNumberErrorMessage = await this.page.isVisible(
      "p#nonUKAddressApartmentNumber-error"
    );
    const buildingNumberErrorMessage = await this.page.isVisible(
      "p#nonUKAddressBuildingNumber-error"
    );
    const buildingNameErrorMessage = await this.page.isVisible(
      "p#nonUKAddressBuildingName-error"
    );

    const errorInputs = await this.page.locator(
      "input[aria-describedby='buildingAddress-error']"
    );
    const buildAddressHeaderError = buildAddressError?.trim() || "";

    return {
      errorMessage: buildAddressHeaderError,
      hasIndividualInputMessage:
        apartmentNumberErrorMessage ||
        buildingNumberErrorMessage ||
        buildingNameErrorMessage,
      errorInputCount: await errorInputs.count(),
    };
  }
};
