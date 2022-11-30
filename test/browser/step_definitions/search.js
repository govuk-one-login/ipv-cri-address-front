const { Given, Then } = require("@cucumber/cucumber");
const { SearchPage } = require("../pages");
const { expect } = require("chai");

Given("they searched for their postcode {string}", async function (postcode) {
  const searchPage = new SearchPage(this.page);
  await searchPage.searchPostcode(postcode);
});

Then(/they should see the search page$/, async function () {
  const searchPage = new SearchPage(this.page);
  expect(searchPage.isCurrentPage()).to.be.true;
});

Then(
  "they should see an error message on the search page {string}",
  async function (value) {
    const searchPage = new SearchPage(this.page);
    const error = await searchPage.getErrorSummary();
    expect(error).to.contain(value);
  }
);

// Previous specific

Then("they should see the previous address search page", function () {
  const searchPage = new SearchPage(this.page);
  expect(searchPage.isCurrentPage()).to.be.true;
});

Then("they should see the search page content in Welsh", async function () {
  const searchPage = new SearchPage(this.page);
  expect(await searchPage.getPageTitle()).to.include(
    "Darganfyddwch eich cyfeiriad"
  );
});

Then("they should see the search page content in English", async function () {
  const searchPage = new SearchPage(this.page);
  expect(await searchPage.getPageTitle()).to.include("Find your address");
});

Then(
  "they should see the search postcode prefilled with {string}",
  async function (value) {
    const searchPage = new SearchPage(this.page);
    const input = await searchPage.getPostcode();

    expect(input).to.equal(value);
  }
);

Then("they should not see the search postcode prefilled", async function () {
  const searchPage = new SearchPage(this.page);
  const input = await searchPage.getPostcode();

  expect(input).to.equal("");
});

Then(
  /^the driving licence callout should (not ){0,1}be visible$/,
  async function (visibleAsString) {
    const visible = visibleAsString !== "not ";

    const searchPage = new SearchPage(this.page);

    expect(await searchPage.drivingLicenceCalloutIsVisible()).to.equal(visible);
  }
);
