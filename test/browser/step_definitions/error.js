import { Then } from "@cucumber/cucumber";
import assert from "node:assert";
import { ErrorPage } from "../pages/index.js";

Then("they should see an error page", async function () {
  const errorPage = new ErrorPage(this.page);
  const errorTitle = await errorPage.getErrorTitle();
  assert.strictEqual(errorTitle, errorPage.getSomethingWentWrongMessage());
});
