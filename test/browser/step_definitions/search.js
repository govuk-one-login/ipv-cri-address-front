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
