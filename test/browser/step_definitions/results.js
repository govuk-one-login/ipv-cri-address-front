const { When, Then } = require("@cucumber/cucumber");
const { ResultsPage } = require("../pages");
const { expect } = require("chai");

Then(/they should see the results page$/, async function () {
  const resultsPage = new ResultsPage(this.page);
  expect(resultsPage.isCurrentPage()).to.be.true;
});

Then(/they should see the previous results page$/, async function () {
  const resultsPage = new ResultsPage(this.page);
  expect(resultsPage.isCurrentPage()).to.be.true;
  expect(await resultsPage.getPageTitle()).to.contain("previous");
});

Then("they should see the result postcode {string}", async function (value) {
  const resultPage = new ResultsPage(this.page);
  const input = await resultPage.getPostcode();
  expect(input).to.equal(value);
});

When("they have selected an address {string}", async function (value) {
  const resultPage = new ResultsPage(this.page);
  if (value === "") {
    await resultPage.selectAddress();
  } else if (value === "default") {
    await resultPage.selectAddress("");
  } else {
    await resultPage.selectAddress(value);
  }
  await resultPage.continue();
});

When(/they have selected their previous address$/, async function () {
  const resultsPage = new ResultsPage(this.page);
  await resultsPage.selectAddress("3A TEST STREET, TESTTOWN, PR3VC0DE");
  await resultsPage.continue();
});

When(/they have selected Cant find address$/, async function () {
  const resultsPage = new ResultsPage(this.page);
  await resultsPage.selectCantFindMyAddress();
});

When(/they select change postcode$/, async function () {
  const resultsPage = new ResultsPage(this.page);
  await resultsPage.selectChangePostcode();
});

Then(
  "they should see an error message on the results page {string}",
  async function (value) {
    const resultsPage = new ResultsPage(this.page);
    const text = await resultsPage.getErrorSummary();
    expect(text).to.include(value);
  }
);
