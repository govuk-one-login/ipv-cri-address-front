import { Then, When } from "@cucumber/cucumber";
import assert from "node:assert";
import { decodeJwt } from "jose";
import { ConfirmPage, AddressPage } from "../pages/index.js";

let payload;

Then(/they should be able to confirm the address$/, async function () {
  const confirmPage = new ConfirmPage(this.page);
  assert.strictEqual(confirmPage.isCurrentPage(), true);
  await confirmPage.confirmDetails();
});

Then(/they should be able confirm both their addresses$/, async function () {
  const confirmPage = new ConfirmPage(this.page);
  assert.strictEqual(confirmPage.isCurrentPage(), true);
  await confirmPage.confirmDetails();
});

Then("they should see the confirmation page", async function () {
  const confirmPage = new ConfirmPage(this.page);
  assert.strictEqual(confirmPage.isCurrentPage(), true);
});

Then("they should be able to confirm their details", async function () {
  const confirmPage = new ConfirmPage(this.page);
  await confirmPage.confirmDetails();
});

Then("they should see the confirm page", function () {
  const confirmPage = new ConfirmPage(this.page);
  assert.strictEqual(confirmPage.isCurrentPage(), true);
});

Then("they should see the address value {string}", async function (value) {
  const confirmPage = new ConfirmPage(this.page);
  const text = await confirmPage.returnCurrentAddress();
  assert.ok(text.includes(value));
});

Then("they should see the year value {string}", async function (value) {
  const confirmPage = new ConfirmPage(this.page);
  const text = await confirmPage.returnYearFromValue();
  const addressPage = new AddressPage(this.page);
  const year = await addressPage.getYear(value);
  assert.ok(text.includes(year));
});

Then("they should see the previous address modal", async function () {
  const confirmPage = new ConfirmPage(this.page);
  const radioLegendTitle = await confirmPage.returnRadioLegend();
  assert.ok(radioLegendTitle.includes("in the past 3 months"));
});

Then("they should not see the previous address modal", async function () {
  const confirmPage = new ConfirmPage(this.page);
  const presence = await confirmPage.isAddressRadioButtonPresent();
  assert.strictEqual(presence, false);
});

Then("they should see an error message {string}", async function (value) {
  const confirmPage = new ConfirmPage(this.page);
  const text = await confirmPage.getErrorSummary();
  assert.ok(text.includes(value));
});

When("they click change current address", async function () {
  const confirmPage = new ConfirmPage(this.page);
  await confirmPage.changeCurrentAddress();
});

When("they click change year from", async function () {
  const confirmPage = new ConfirmPage(this.page);
  await confirmPage.changeYearFrom();
});

When("they confirm their details", async function () {
  const confirmPage = new ConfirmPage(this.page);
  await confirmPage.confirmDetails();
});

Then("the callback is converted to JSON", async function () {
  payload = await decodeJwtPayload(this.page);
});

async function decodeJwtPayload(page) {
  const jwt = await page.locator("body").innerText();

  try {
    return decodeJwt(jwt);
  } catch (err) {
    throw new Error(`Failed to decode VC from page body: ${err.message}`, {
      cause: err,
    });
  }
}

Then("the address data for the user is within the JSON", async function () {
  if (payload.vc.credentialSubject.address.length > 1) {
    assert.equal(payload.vc.credentialSubject.address[0].postalCode, "E18QS");
    assert.equal(payload.vc.credentialSubject.address[1].postalCode, "BA25AA");
  } else {
    assert.equal(payload.vc.credentialSubject.address[0].postalCode, "E18QS");
  }
});

Then(
  "the address data for the international user is within the JSON",
  async function () {
    if (payload.vc.credentialSubject.address[0].postalCode === "") {
      assert.equal(
        payload.vc.credentialSubject.address[0].addressCountry,
        "KE"
      );
    } else {
      assert.equal(payload.vc.credentialSubject.address[0].postalCode, "00100");
    }
  }
);
When(
  "they select the previous UK address within three months radio button",
  async function () {
    const confirmPage = new ConfirmPage(this.page);
    await confirmPage.selectYesRadioButton();
  }
);
When(
  "they select no previous UK address within three months radio button",
  async function () {
    const confirmPage = new ConfirmPage(this.page);
    await confirmPage.selectNoRadioButton();
  }
);
