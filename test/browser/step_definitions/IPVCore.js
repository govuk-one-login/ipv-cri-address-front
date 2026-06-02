import { Then } from "@cucumber/cucumber";
import assert from "node:assert";
import { IPVCorePage } from "../pages/index.js";

Then("they should redirected back to core", async function () {
  // will probably change
  const core = new IPVCorePage(this.page);
  assert.strictEqual(core.isCurrentPage(), true);
});
