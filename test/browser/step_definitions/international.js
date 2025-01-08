const { Given, Then, When } = require("@cucumber/cucumber");
const {
  CountryPage,
  InternationalAddressPage,
  SearchPage,
} = require("../pages");
const { expect } = require("chai");

Then("they should see the country selector page", async function () {
  const countryPage = new CountryPage(this.page);

  expect(countryPage.isCurrentPage()).to.be.true;
});

When("they have selected the country {string}", async function (value) {
  const countryPage = new CountryPage(this.page);
  await countryPage.selectCountry(value);
});

Then("they click the continue button", async function () {
  const countryPage = new CountryPage(this.page);

  await countryPage.continue();
});

Given("they are on the international address form", async function () {
  const internationalAddressPage = new InternationalAddressPage(this.page);
  expect(internationalAddressPage.isCurrentPage()).to.be.true;
});

Then("they should see international address form", async function () {
  const internationalAddressPage = new InternationalAddressPage(this.page);

  expect(internationalAddressPage.isCurrentPage()).to.be.true;
});

Then("they should see the UK address form", async function () {
  const internationalAddressPage = new SearchPage(this.page);

  expect(internationalAddressPage.isCurrentPage()).to.be.true;
});

When("they have not selected a country", async function () {
  const countryPage = new CountryPage(this.page);

  await countryPage.continue();
});

Then(
  "they should see an error message on the country page {string}",
  async function (value) {
    const countryPage = new CountryPage(this.page);
    const error = await countryPage.getErrorSummary();

    expect(error).to.contain(value);
  }
);

When(
  "they add their building address apartment number {string}",
  async function (value) {
    const internationalAddressPage = new InternationalAddressPage(this.page);

    await internationalAddressPage.addApartmentNumber(value);
  }
);

Then(
  "they add their building address apartment name {string}",
  async function (value) {
    const internationalAddressPage = new InternationalAddressPage(this.page);

    await internationalAddressPage.addApartmentNumber(value);
  }
);

Then("they add their building address name {string}", async function (value) {
  const internationalAddressPage = new InternationalAddressPage(this.page);

  await internationalAddressPage.addBuildingName(value);
});

Then("they add their building address number {string}", async function (value) {
  const internationalAddressPage = new InternationalAddressPage(this.page);

  await internationalAddressPage.addBuildingNumber(value);
});

Then("they add their international street {string}", async function (value) {
  const internationalAddressPage = new InternationalAddressPage(this.page);

  await internationalAddressPage.addStreet(value);
});

Then("they add their town, suburb or city {string}", async function (value) {
  const internationalAddressPage = new InternationalAddressPage(this.page);

  await internationalAddressPage.addTownOrCity(value);
});

Then("they add their Postal code or zipcode {string}", async function (value) {
  const internationalAddressPage = new InternationalAddressPage(this.page);

  await internationalAddressPage.addAddressPostalCode(value);
});

Then("they add their Region {string}", async function (value) {
  const internationalAddressPage = new InternationalAddressPage(this.page);

  await internationalAddressPage.addRegion(value);
});

Then(
  "they add the {string} year they started living at this address",
  async function (date) {
    const internationalAddressPage = new InternationalAddressPage(this.page);
    await internationalAddressPage.addYearFrom(date);
  }
);

Then(/they continue to confirm international address$/, async function () {
  const internationalAddressPage = new InternationalAddressPage(this.page);

  await internationalAddressPage.continue();
});

Then("they click change country link", async function () {
  const internationalAddressPage = new InternationalAddressPage(this.page);

  await internationalAddressPage.change();
});

Then("they see the change country link {string}", async function (value) {
  const internationalAddressPage = new InternationalAddressPage(this.page);

  const selectedCountry =
    await internationalAddressPage.getChangeAddressValue();

  expect(selectedCountry).to.include(value);
});

Then(
  "they should also see the selected country is still {string}",
  async function (value) {
    const countryPage = new CountryPage(this.page);

    const selectedCountry = await countryPage.getSelectedCountry();

    expect(selectedCountry).to.contain(value);
  }
);

Then("they should also see the selected country is empty", async function () {
  const countryPage = new CountryPage(this.page);

  const selectedCountry = await countryPage.getSelectedCountry();

  expect(selectedCountry).to.equal("");
});

Then(
  "they see an error summary with failed validation message: {string}",
  async function (message) {
    const internationalAddressPage = new InternationalAddressPage(this.page);
    const summary = await internationalAddressPage.getErrorSummary();

    expect(summary).to.include(message);
  }
);
Then(
  "they see 3 building address input fields highlighted as invalid with error summary and message: {string}",
  async function (message) {
    const internationalAddressPage = new InternationalAddressPage(this.page);
    const buildingError =
      await internationalAddressPage.getErrorBuildingAddress();

    const errorMessage = buildingError.errorMessage;
    const hasIndividualInputError = buildingError.hasIndividualInputMessage;
    const errorInputCount = buildingError.errorInputCount;

    expect(hasIndividualInputError).to.be.false;
    expect(errorMessage).to.equal(`error: ${message}`);
    expect(errorInputCount).to.equal(3);
  }
);

Then(
  "they see the Apartment Number Input with value {string}",
  async function (value) {
    const internationalAddressPage = new InternationalAddressPage(this.page);

    const apartmentNumberInput =
      await internationalAddressPage.getApartmentNumber();

    expect(apartmentNumberInput).to.include(value);
  }
);

Then("they see the Town Input with value {string}", async function (value) {
  const internationalAddressPage = new InternationalAddressPage(this.page);

  const townInput = await internationalAddressPage.getTownOrCity();

  expect(townInput).to.include(value);
});

Then("they see the Region with value {string}", async function (value) {
  const internationalAddressPage = new InternationalAddressPage(this.page);

  const regionInput = await internationalAddressPage.getTownOrCity();

  expect(regionInput).to.include(value);
});

Then("they see the Year From with value {string}", async function (value) {
  const internationalAddressPage = new InternationalAddressPage(this.page);

  const yearInput = await internationalAddressPage.getYearFrom();

  expect(yearInput).to.include(internationalAddressPage.getYear(value));
});
