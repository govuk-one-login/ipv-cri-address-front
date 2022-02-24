const { Given, When, Then } = require("@cucumber/cucumber");
const {
  SearchPage,
  ResultsPage,
  ConfirmPage,
  AddressPage,
} = require("../pages");
const { expect } = require("chai");

/**
 * GIVEN
 */
Given(/^^([A-Za-z ])+ is using the system$/, async function (name) {
  this.user = this.allUsers[name];
});

Given(/^they (?:have )?start(?:ed)? the address journey$/, async function () {
  const searchPage = new SearchPage(this.page);
  await searchPage.goto();
  expect(searchPage.isCurrentPage()).to.be.true;
  expect(await searchPage.getPageTitle()).to.not.be.empty;
});

Given("they searched for their postcode {string}", async function (postcode) {
  const searchPage = new SearchPage(this.page);
  await searchPage.searchPostcode(postcode);
});

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
