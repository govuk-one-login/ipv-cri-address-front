const { When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert");
const { ErrorPage } = require("../pages");

When("there is an immediate error", () => {});

Then("they should see the unrecoverable error page", async function () {
  const errorPage = new ErrorPage(this.page);
  const errorTitle = await errorPage.getErrorTitle();
  assert.strictEqual(errorTitle, errorPage.getSomethingWentWrongMessage());
});
