const { Then } = require("@cucumber/cucumber");
const { IPVCorePage } = require("../pages");
const { expect } = require("chai");

Then("they should redirected back to core", async function () {
  // will probably change
  const core = new IPVCorePage(this.page);
  expect(core.isCorePage()).to.be.true;
});
