import { When, Then } from "@cucumber/cucumber";
import assert from "node:assert";
import { ErrorPage } from "../pages/index.js";

When("there is an immediate error", () => {});

Then("they should see the unrecoverable error page", async function () {
  const errorPage = new ErrorPage(this.page);
  const errorTitle = await errorPage.getErrorTitle();
  assert.strictEqual(errorTitle, errorPage.getSomethingWentWrongMessage());
});
