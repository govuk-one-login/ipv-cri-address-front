const { Given, Then, When } = require("@cucumber/cucumber");
const { TimeAtAddressPage, AddressPage } = require("../pages");
const { expect } = require("chai");

Given(
  /they (?:can )?(?:should )?see? the time at address page$/,
  async function () {
    const timeAtAddressPage = new TimeAtAddressPage(this.page);
    expect(timeAtAddressPage.isCurrentPage()).to.be.true;
  }
);
When(/^they continue from time at address$/, async function () {
  const timeAtAddressPage = new TimeAtAddressPage(this.page);
  await timeAtAddressPage.continue();
});
