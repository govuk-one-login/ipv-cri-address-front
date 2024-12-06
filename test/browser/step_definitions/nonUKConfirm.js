const { Then, When } = require("@cucumber/cucumber");
const { NonUKConfirmPage } = require("../pages");
const { AddressPage } = require("../pages");
const { expect } = require("chai");

Then("they should see the non UK confirm page", function () {
  const nonUKConfirmPage = new NonUKConfirmPage(this.page);
  expect(nonUKConfirmPage.isCurrentPage()).to.be.true;
});

Then(
  "they should see the non UK address value {string}",
  async function (value) {
    const nonUKConfirmPage = new NonUKConfirmPage(this.page);
    const text = await nonUKConfirmPage.returnCurrentAddress();
    expect(text.trim()).equal(value);
  }
);

Then("they should see the non UK year value {string}", async function (value) {
  const nonUKConfirmPage = new NonUKConfirmPage(this.page);
  const text = await nonUKConfirmPage.returnYearFromValue();
  const addressPage = new AddressPage(this.page);
  const year = await addressPage.getYear(value);
  expect(text).to.include(year);
});

Then(
  "they should not see the previous address radio button",
  async function () {
    const nonUKConfirmPage = new NonUKConfirmPage(this.page);
    const presence = await nonUKConfirmPage.isAddressRadioButtonPresent();
    expect(presence).equal(false);
  }
);

Then("they should not see the previous address row", async function () {
  const nonUKConfirmPage = new NonUKConfirmPage(this.page);
  const presence = await nonUKConfirmPage.isPreviousAddressRowPresent();
  expect(presence).equal(false);
});

When("they click change non UK address", async function () {
  const nonUKConfirmPage = new NonUKConfirmPage(this.page);
  await nonUKConfirmPage.changeCurrentAddress();
});

When("they click change non UK year from", async function () {
  const nonUKConfirmPage = new NonUKConfirmPage(this.page);
  await nonUKConfirmPage.changeYearFrom();
});

When("they click back from non UK confirm page", async function () {
  const nonUKConfirmPage = new NonUKConfirmPage(this.page);
  await nonUKConfirmPage.clickBackOnPage();
});

When("they navigate back from non UK confirm", async function () {
  const nonUKConfirmPage = new NonUKConfirmPage(this.page);
  await nonUKConfirmPage.page.goBack();
});

When("they confirm their non UK details", async function () {
  const nonUKConfirmPage = new NonUKConfirmPage(this.page);
  await nonUKConfirmPage.confirmDetails();
});
