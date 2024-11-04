const { Then, When } = require("@cucumber/cucumber");
const { ConfirmPage } = require("../pages");
const { AddressPage } = require("../pages");
const { expect } = require("chai");

Then(/they should be able to confirm the address$/, async function () {
  const confirmPage = new ConfirmPage(this.page);
  expect(confirmPage.isCurrentPage()).to.be.true;
  await confirmPage.confirmDetails();
});

Then(/they should be able confirm both their addresses$/, async function () {
  const confirmPage = new ConfirmPage(this.page);
  expect(confirmPage.isCurrentPage()).to.be.true;
  await confirmPage.confirmDetails();
});

Then("they should see the confirmation page", async function () {
  const confirmPage = new ConfirmPage(this.page);
  expect(confirmPage.isCurrentPage()).to.be.true;
});

Then("they should be able to confirm their details", async function () {
  const confirmPage = new ConfirmPage(this.page);
  await confirmPage.confirmDetails();
});

Then(
  "they can select they have lived their for {string}",
  async function (value) {
    const confirmPage = new ConfirmPage(this.page);
    if (value === ">3") {
      await confirmPage.selectNoRadioButton();
    } else {
      await confirmPage.selectYesRadioButton();
    }
  }
);

Then("they should see the confirm page", function () {
  const confirmPage = new ConfirmPage(this.page);
  expect(confirmPage.isCurrentPage()).to.be.true;
});

Then("they should see the address value {string}", async function (value) {
  const confirmPage = new ConfirmPage(this.page);
  const text = await confirmPage.returnCurrentAddress();
  expect(text).to.include(value);
});

Then("they should see the year value {string}", async function (value) {
  const confirmPage = new ConfirmPage(this.page);
  const text = await confirmPage.returnYearFromValue();
  const addressPage = new AddressPage(this.page);
  const year = await addressPage.getYear(value);
  expect(text).to.include(year);
});

Then("they should see the previous address modal", async function () {
  const confirmPage = new ConfirmPage(this.page);
  const radioLegendTitle = await confirmPage.returnRadioLegend();
  expect(radioLegendTitle).to.include("in the past 3 months");
});

Then("they should not see the previous address modal", async function () {
  const confirmPage = new ConfirmPage(this.page);
  const presence = await confirmPage.isAddressRadioButtonPresent();
  expect(presence).equal(false);
});

Then("they should see an error message {string}", async function (value) {
  const confirmPage = new ConfirmPage(this.page);
  const text = await confirmPage.getErrorSummary();
  expect(text).to.include(value);
});

When("they click change current address", async function () {
  const confirmPage = new ConfirmPage(this.page);
  await confirmPage.changeCurrentAddress();
});

When("they click change year from", async function () {
  const confirmPage = new ConfirmPage(this.page);
  await confirmPage.changeYearFrom();
});

When("they confirm their details", async function () {
  const confirmPage = new ConfirmPage(this.page);
  await confirmPage.confirmDetails();
});

When(
  "they select the previous UK address within three months radio button",
  async function () {
    const confirmPage = new ConfirmPage(this.page);
    await confirmPage.selectYesRadioButton();
  }
);
