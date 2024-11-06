const { Given, Then, When } = require("@cucumber/cucumber");
const { CountryPage, InternationalAddressPage } = require("../pages");
const { expect } = require("chai");

Then("they should see the country selector page", async function () {
  const countryPage = new CountryPage(this.page);
  expect(countryPage.isCurrentPage()).to.be.true;
});

When("they have selected the country {string}", async function (value) {
  const countryPage = new CountryPage(this.page);
  await countryPage.selectCountry(value);
  await countryPage.continue();
});

Then("they should see international address form", async function () {
  const internationalAddressPage = new InternationalAddressPage(this.page);
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
