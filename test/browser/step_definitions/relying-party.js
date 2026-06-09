import { Given, When, Then } from "@cucumber/cucumber";
import assert from "node:assert";
import { RelyingPartyPage } from "../pages/index.js";

Given(/^([A-Za-z ])+ is using the system$/, async function (name) {
  this.user = this.allUsers[name];

  const rpPage = new RelyingPartyPage(this.page);
  const clientId = this.clientId || "standalone";
  await rpPage.goto(clientId);
});

Given("they have been redirected as a success", function () {
  const rpPage = new RelyingPartyPage(this.page);
  assert.strictEqual(rpPage.isRelyingPartyServer(), true);

  const clientId = this.clientId || "standalone";
  assert.strictEqual(rpPage.hasSuccessQueryParams(clientId), true);
});

Then(
  "they should be redirected as an error with a description {string}",
  function (err) {
    const rpPage = new RelyingPartyPage(this.page);

    assert.strictEqual(rpPage.isRelyingPartyServer(), true);
    assert.strictEqual(rpPage.hasErrorQueryParams(err), true);
  }
);

Then(/^they should be redirected as a success$/, function () {
  const rpPage = new RelyingPartyPage(this.page);
  assert.strictEqual(rpPage.isRelyingPartyServer(), true);

  const clientId = this.clientId || "standalone";
  assert.strictEqual(rpPage.hasSuccessQueryParams(clientId), true);
});

Then(/^the error should be (.*)$/, function (error_code) {
  const rpPage = new RelyingPartyPage(this.page);

  assert.strictEqual(rpPage.isRelyingPartyServer(), true);
  assert.strictEqual(rpPage.isErrorCode(error_code), true);
});

When(/^they return to a previous page$/, async function () {
  const rpPage = new RelyingPartyPage(this.page);
  await rpPage.page.goBack();
});
