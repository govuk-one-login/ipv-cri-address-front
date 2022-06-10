const { Given, When, Then } = require("@cucumber/cucumber");
const {
  SearchPage,
  ResultsPage,
  ConfirmPage,
  AddressPage,
  RelyingPartyPage,
  ProblemPage,
  PreviousPage,
  IPVCorePage,
} = require("../pages");
const { expect } = require("chai");

/**
 * GIVEN
 */
Given(/^^([A-Za-z ])+ is using the system$/, async function (name) {
  this.user = this.allUsers[name];

  const rpPage = new RelyingPartyPage(this.page);

  await rpPage.goto();
});

Given(/^they (?:have )?start(?:ed)? the address journey$/, async function () {
  // const ipvCorePage = new IPVCorePage(this.page);
  // await ipvCorePage.chooseCredentialIssuer();
  //
  // const searchPage = new SearchPage(this.page);
  // expect(searchPage.isCurrentPage()).to.be.true;
  // expect(await searchPage.getPageTitle()).to.not.be.empty;
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

Given("they are on the address page", async function () {
  const addressPage = new AddressPage(this.page);
  expect(addressPage.isCurrentPage()).to.be.true;
});

/**
 * THEN
 */

Then(/they should see the search page$/, async function () {
  const searchPage = new SearchPage(this.page);
  expect(searchPage.isCurrentPage()).to.be.true;
});

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

Then("they should continue to the confirm page", async function () {
  const addressPage = new AddressPage(this.page);
  await addressPage.continue();
});

Then("they should see the confirmation page", async function () {
  const confirmPage = new ConfirmPage(this.page);
  expect(confirmPage.isCurrentPage()).to.be.true;
});

Then("they should be able to confirm their details", async function () {
  const confirmPage = new ConfirmPage(this.page);
  await confirmPage.confirmDetails();
});

Then("they should see the additional details selector", async function () {
  const confirmPage = new ConfirmPage(this.page);
  const isVisible = await confirmPage.isRadioSelectorVisible();
  expect(isVisible).to.equal(true);
});

Then("they should not see the additional details selector", async function () {
  const confirmPage = new ConfirmPage(this.page);
  const isVisible = await confirmPage.isRadioSelectorVisible();
  expect(isVisible).to.equal(false);
});

Then(
  "they can select they have lived their for {string}",
  async function (value) {
    const confirmPage = new ConfirmPage(this.page);
    if (value === ">3") {
      await confirmPage.selectYesRadioButton();
    } else {
      await confirmPage.selectNoRadioButton();
    }
  }
);

Then("they should see the previous address page", async function () {
  const previousPage = new PreviousPage(this.page);
  expect(previousPage.isCurrentPage()).to.be.true;
});

Then("they should redirected back to core", async function () {
  // will probably change
  const core = new IPVCorePage(this.page);
  expect(core.isCorePage()).to.be.true;
});

Then(
  "they should see an error message on the search page {string}",
  async function (value) {
    const searchPage = new SearchPage(this.page);
    const error = await searchPage.getErrorSummary();
    expect(error).to.contain(value);
  }
);

Then("they should see the result postcode {string}", async function (value) {
  const resultPage = new ResultsPage(this.page);
  const input = await resultPage.getPostcode();
  expect(input).to.equal(value);
});

Then(
  "they should see the postcode prefilled with {string}",
  async function (value) {
    const addressPage = new AddressPage(this.page);
    const input = await addressPage.getPostcode();
    expect(input).to.equal(value);
  }
);

Then(
  "they should see an error message on the address page {string}",
  async function (value) {
    const addressPage = new AddressPage(this.page);
    const error = await addressPage.getErrorSummary();
    expect(error).to.contain(value);
  }
);

Then("they should see the confirm page", function () {
  const confirmPage = new ConfirmPage(this.page);
  expect(confirmPage.isCurrentPage()).to.be.true;
});

Then(
  "they should see flat number prefilled with {string}",
  async function (value) {
    const addressPage = new AddressPage(this.page);
    const input = await addressPage.getFlatNumber();
    expect(input).to.equal(value);
  }
);

Then(
  "they should see house number prefilled with {string}",
  async function (value) {
    const addressPage = new AddressPage(this.page);
    const input = await addressPage.getHouseNumber();
    expect(input).to.equal(value);
  }
);

Then(
  "they should see house name prefilled with {string}",
  async function (value) {
    const addressPage = new AddressPage(this.page);
    const input = await addressPage.getHouseName();
    expect(input).to.equal(value);
  }
);

Then("they should see street prefilled with {string}", async function (value) {
  const addressPage = new AddressPage(this.page);
  const input = await addressPage.getStreet();
  expect(input).to.equal(value);
});

Then(
  "they should see town or city prefilled with {string}",
  async function (value) {
    const addressPage = new AddressPage(this.page);
    const input = await addressPage.getTownOrCity();
    expect(input).to.equal(value);
  }
);

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

When(/they see the problem page$/, async function () {
  const problemPage = new ProblemPage(this.page);

  expect(problemPage.isCurrentPage()).to.be.true;
});

When(/they choose manual entry/, async function () {
  const problemPage = new ProblemPage(this.page);

  await problemPage.chooseManualEntry();
  await problemPage.continue();
});

When(/they choose go back to search/, async function () {
  const problemPage = new ProblemPage(this.page);

  await problemPage.chooseGoBackToSearch();
  await problemPage.continue();
});

When(/they have selected Cant find address$/, async function () {
  const resultsPage = new ResultsPage(this.page);
  await resultsPage.selectCantFindMyAddress();
});

When(/they select change postcode$/, async function () {
  const resultsPage = new ResultsPage(this.page);
  await resultsPage.selectChangePostcode();
});

When(/they continue to confirm address$/, async function () {
  const addressPage = new AddressPage(this.page);
  await addressPage.continue();
});

When("they add their residency date {string}", async function (date) {
  const addressPage = new AddressPage(this.page);
  await addressPage.addYearFrom(date);
});

When("they add their street {string}", async function (value) {
  const addressPage = new AddressPage(this.page);
  await addressPage.addStreet(value);
});

When("they add their city {string}", async function (value) {
  const addressPage = new AddressPage(this.page);
  await addressPage.addTownOrCity(value);
});

When("they add their house number {string}", async function (value) {
  const addressPage = new AddressPage(this.page);
  await addressPage.addHouseNumber(value);
});

When("they add their flat number {string}", async function (value) {
  const addressPage = new AddressPage(this.page);
  await addressPage.addFlatNumber(value);
});

When("they add their house name {string}", async function (value) {
  const addressPage = new AddressPage(this.page);
  await addressPage.addHouseName(value);
});
