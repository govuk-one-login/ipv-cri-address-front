const { Then } = require("@cucumber/cucumber");
const { IPVCorePage } = require("../pages");
const assert = require("node:assert");

Then("they should redirected back to core", async function () {
  // will probably change
  const core = new IPVCorePage(this.page);
  assert.strictEqual(core.isCurrentPage(), true);
});
