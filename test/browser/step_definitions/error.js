const { Then } = require("@cucumber/cucumber");
const assert = require("node:assert");
const { ErrorPage } = require("../pages");

Then("they should see an error page", async function () {
  const errorPage = new ErrorPage(this.page);
  const errorTitle = await errorPage.getErrorTitle();
  assert.strictEqual(errorTitle, errorPage.getSomethingWentWrongMessage());
});
