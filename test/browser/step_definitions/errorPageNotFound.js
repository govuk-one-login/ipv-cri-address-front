const { When, Then } = require("@cucumber/cucumber");
const assert = require("node:assert");
const { ErrorPage } = require("../pages");

When("they go to an unknown page", async function () {
  const errorPage = new ErrorPage(this.page);
  await errorPage.goToPage("not-going-to-be-found");
});

Then("they should see the Page not found error page", async function () {
  const errorPage = new ErrorPage(this.page);
  const errorPageHeader = await errorPage.getPageHeader();
  assert.ok(errorPageHeader.includes("Page not found"));
});
