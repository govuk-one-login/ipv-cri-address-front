import { Given, Then, When } from "@cucumber/cucumber";
import assert from "node:assert";
import { AddressPage } from "../pages/index.js";

Given(
  /^they (?:have )?start(?:ed)? the address journey$/,
  async function () {}
);

Given("they are on the address page", async function () {
  const addressPage = new AddressPage(this.page);
  assert.strictEqual(addressPage.isCurrentPage(), true);
});

Then(/they should see the address page$/, async function () {
  const addressPage = new AddressPage(this.page);
  assert.strictEqual(addressPage.isCurrentPage(), true);
});

Then("they click back from the address page", async function () {
  const addressPage = new AddressPage(this.page);
  await addressPage.clickBackOnPage();
});

Then("they should continue to the confirm page", async function () {
  const addressPage = new AddressPage(this.page);
  await addressPage.continue();
});

Then(
  "they should see the postcode prefilled with {string}",
  async function (value) {
    const addressPage = new AddressPage(this.page);
    const input = await addressPage.getPostcode();
    assert.strictEqual(input, value);
  }
);

Then(
  "they should see flat number prefilled with {string}",
  async function (value) {
    const addressPage = new AddressPage(this.page);
    const input = await addressPage.getFlatNumber();
    assert.strictEqual(input, value);
  }
);

Then(
  "they should see house number prefilled with {string}",
  async function (value) {
    const addressPage = new AddressPage(this.page);
    const input = await addressPage.getHouseNumber();
    assert.strictEqual(input, value);
  }
);

Then(
  "they should see house name prefilled with {string}",
  async function (value) {
    const addressPage = new AddressPage(this.page);
    const input = await addressPage.getHouseName();
    assert.strictEqual(input, value);
  }
);

Then("they should see street prefilled with {string}", async function (value) {
  const addressPage = new AddressPage(this.page);
  const input = await addressPage.getStreet();
  assert.strictEqual(input, value);
});

Then(
  "they should see town or city prefilled with {string}",
  async function (value) {
    const addressPage = new AddressPage(this.page);
    const input = await addressPage.getTownOrCity();
    assert.strictEqual(input, value);
  }
);

When(
  "they add their residency date with a {string} move year",
  async function (date) {
    const addressPage = new AddressPage(this.page);
    await addressPage.addYearFrom(date);
  }
);

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

When(/they continue to confirm address$/, async function () {
  const addressPage = new AddressPage(this.page);
  await addressPage.continue();
});

Then(
  "they should see an error message on the address page {string}",
  async function (value) {
    const addressPage = new AddressPage(this.page);
    const error = await addressPage.getErrorSummary();
    assert.ok(error.includes(value));
  }
);
