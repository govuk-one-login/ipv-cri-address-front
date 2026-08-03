import { test } from "@playwright/test";
import {
  CountryPage,
  InternationalAddressPage,
  NonUKConfirmPage,
} from "../browser/pages/index.js";
import assert from "node:assert";
import { takeAndCompareScreenshots } from "./helper/screenshot-config.js";
import { goToAddressStart } from "./helper/function-helper.js";

test("Happy path international address", async ({ page }) => {
  await goToAddressStart(page, "international-address");

  const countryPage = new CountryPage(page);
  assert.strictEqual(countryPage.isCurrentPage(), true);
  await takeAndCompareScreenshots(page, "what-country");
  await countryPage.selectCountry("Kenya");
  await countryPage.continue();

  const internationalAddressPage = new InternationalAddressPage(page);
  assert.strictEqual(internationalAddressPage.isCurrentPage(), true);
  await takeAndCompareScreenshots(page, "non-uk-address");
  await internationalAddressPage.addApartmentNumber("A2");
  await internationalAddressPage.addTownOrCity("Nairobi");
  await internationalAddressPage.addYearFrom("older");
  await internationalAddressPage.continue();

  const nonUKConfirmPage = new NonUKConfirmPage(page);
  assert.strictEqual(nonUKConfirmPage.isCurrentPage(), true);
  await takeAndCompareScreenshots(page, "non-uk-confirm");
});

test("Happy path international address in Welsh", async ({ page }) => {
  await goToAddressStart(page, "international-address", "cy");

  const countryPage = new CountryPage(page);
  assert.strictEqual(countryPage.isCurrentPage(), true);
  await takeAndCompareScreenshots(page, "what-country-cy");
  await countryPage.selectCountry("Kenya");
  await countryPage.continue();

  const internationalAddressPage = new InternationalAddressPage(page);
  assert.strictEqual(internationalAddressPage.isCurrentPage(), true);
  await takeAndCompareScreenshots(page, "non-uk-address-cy");
  await internationalAddressPage.addApartmentNumber("A2");
  await internationalAddressPage.addTownOrCity("Nairobi");
  await internationalAddressPage.addYearFrom("older");
  await internationalAddressPage.continue();

  const nonUKConfirmPage = new NonUKConfirmPage(page);
  assert.strictEqual(nonUKConfirmPage.isCurrentPage(), true);
  await takeAndCompareScreenshots(page, "non-uk-confirm-cy");
});
