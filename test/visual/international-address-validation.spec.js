import { test } from "@playwright/test";
import {
  CountryPage,
  InternationalAddressPage,
} from "../browser/pages/index.js";
import assert from "node:assert";
import { takeAndCompareScreenshots } from "./helper/screenshot-config.js";
import { goToAddressStart } from "./helper/function-helper.js";

test("Error validation - What Country screen", async ({ page }) => {
  await goToAddressStart(page, "international-address");

  const countryPage = new CountryPage(page);
  assert.strictEqual(countryPage.isCurrentPage(), true);
  await countryPage.continue();
  await countryPage.getErrorSummary();
  await takeAndCompareScreenshots(page, "what-country-validation");
});

test("Error validation - Non-UK Address form screen", async ({ page }) => {
  await goToAddressStart(page, "international-address");

  const countryPage = new CountryPage(page);
  assert.strictEqual(countryPage.isCurrentPage(), true);

  await countryPage.selectCountry("Kenya");
  await countryPage.continue();

  const internationalAddressPage = new InternationalAddressPage(page);
  assert.strictEqual(internationalAddressPage.isCurrentPage(), true);
  await internationalAddressPage.continue();
  await takeAndCompareScreenshots(page, "non-uk-address-validation");
});

test("Welsh Error validation - What Country screen", async ({ page }) => {
  await goToAddressStart(page, "international-address", "cy");

  const countryPage = new CountryPage(page);
  assert.strictEqual(countryPage.isCurrentPage(), true);
  await countryPage.continue();
  await countryPage.getErrorSummary();
  await takeAndCompareScreenshots(page, "what-country-validation-cy");
});

test("Welsh Error validation - Non-UK Address form screen", async ({
  page,
}) => {
  await goToAddressStart(page, "international-address", "cy");

  const countryPage = new CountryPage(page);
  assert.strictEqual(countryPage.isCurrentPage(), true);

  await countryPage.selectCountry("Kenya");
  await countryPage.continue();

  const internationalAddressPage = new InternationalAddressPage(page);
  assert.strictEqual(internationalAddressPage.isCurrentPage(), true);
  await internationalAddressPage.continue();
  await takeAndCompareScreenshots(page, "non-uk-address-validation-cy");
});
