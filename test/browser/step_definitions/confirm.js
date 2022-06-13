const { Then, When } = require("@cucumber/cucumber");
const { ConfirmPage } = require("../pages");
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

Then("they should see the confirm page", function () {
  const confirmPage = new ConfirmPage(this.page);
  expect(confirmPage.isCurrentPage()).to.be.true;
});

Then("they should see the previous address modal", async function () {
  const confirmPage = new ConfirmPage(this.page);
  expect(await confirmPage.isRadioSelectorVisible()).to.be.true;
});

Then("they should not see the previous address modal", async function () {
  const confirmPage = new ConfirmPage(this.page);
  expect(await confirmPage.isRadioSelectorVisible()).to.be.false;
});

Then("they should see the address value {string}", async function (value) {
  const confirmPage = new ConfirmPage(this.page);
  const text = await confirmPage.returnCurrentAddress();
  expect(text).to.contain(value);
});

Then("they should see the year value {string}", async function (value) {
  const confirmPage = new ConfirmPage(this.page);
  const text = await confirmPage.returnYearFromValue();
  expect(text).to.contain(value);
});

When("they click change current address", async function () {
  const confirmPage = new ConfirmPage(this.page);
  await confirmPage.changeCurrentAddress();
});

When("they click change year from", async function () {
  const confirmPage = new ConfirmPage(this.page);
  await confirmPage.changeYearFrom();
});
