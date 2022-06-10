const { Then } = require("@cucumber/cucumber");
const { expect } = require("chai");
const { ErrorPage } = require("../pages");

Then("they should see an error page", async function () {
  const errorPage = new ErrorPage(this.page);

  const errorTitle = await errorPage.getErrorTitle();

  expect(errorTitle).to.equal(errorPage.getSomethingWentWrongMessage());
});
