const { Given, When, Then } = require("@cucumber/cucumber");
const {
  SearchPage,
  ResultsPage,
  ConfirmPage,
  AddressPage,
  IPVCorePage,
} = require("../pages");
const { expect } = require("chai");

/**
 * GIVEN
 */
Given(/^^([A-Za-z ])+ is using the system$/, async function (name) {
  this.user = this.allUsers[name];
});

Given(/^they (?:have )?start(?:ed)? the address journey$/, async function () {
  const ipvCorePage = new IPVCorePage(this.page);
  await ipvCorePage.chooseCredentialIssuer();

  const searchPage = new SearchPage(this.page);
  expect(searchPage.isCurrentPage()).to.be.true;
  expect(await searchPage.getPageTitle()).to.not.be.empty;
});

Given("they searched for their postcode {string}", async function (postcode) {
  const searchPage = new SearchPage(this.page);
  await searchPage.searchPostcode(postcode);
});

Given(
  "they have added their current postcode {string}",
  async function (postcode) {
    const searchPage = new SearchPage(this.page);
    await searchPage.goto();
    await searchPage.searchPostcode(postcode);
    const resultsPage = new ResultsPage(this.page);
    await resultsPage.selectAddress();
    await resultsPage.continue();
  }
);

Given("they have entered the previous address journey", async function () {
  const confirmPage = new ConfirmPage(this.page);
  await confirmPage.previousAddressButton();
});

Given(
  "they have searched for their previous postcode {string}",
  async function (prevPostcode) {
    const searchPage = new SearchPage(this.page);
    expect(await searchPage.getPageTitle()).to.contain("previous");
    await searchPage.searchPostcode(prevPostcode);
  }
);

/**
 * THEN
 */
Then(/they should see the results page$/, async function () {
  const resultsPage = new ResultsPage(this.page);
  expect(resultsPage.isCurrentPage()).to.be.true;
});

Then(/they should be able to confirm the address$/, async function () {
  const confirmPage = new ConfirmPage(this.page);
  expect(confirmPage.isCurrentPage()).to.be.true;
  await confirmPage.confirmDetails();
});

Then(/they should see the address page$/, async function () {
  const addressPage = new AddressPage(this.page);
  expect(addressPage.isCurrentPage()).to.be.true;
});

Then(/they should see the previous results page$/, async function () {
  const resultsPage = new ResultsPage(this.page);
  expect(resultsPage.isCurrentPage()).to.be.true;
  expect(await resultsPage.getPageTitle()).to.contain("previous");
});

Then(/they should be able confirm both their addresses$/, async function () {
  const confirmPage = new ConfirmPage(this.page);
  expect(confirmPage.isCurrentPage()).to.be.true;
  await confirmPage.confirmDetails();
});

/**
 * WHEN
 */
When(/they (?:have )select(?:ed)? an address$/, async function () {
  const resultPage = new ResultsPage(this.page);
  await resultPage.selectAddress();
  await resultPage.continue();
});

When(/they (?:have )add(?:ed)? their details manually$/, async function () {
  const addressPage = new AddressPage(this.page);
  await addressPage.addHouseNameOrNumber();
  await addressPage.addStreet();
  await addressPage.addTownOrCity();
  await addressPage.continue();
});

When(/they have selected their previous address$/, async function () {
  const resultsPage = new ResultsPage(this.page);
  await resultsPage.selectAddress("3A TEST STREET, TESTTOWN, PR3VC0DE");
  await resultsPage.continue();
});
