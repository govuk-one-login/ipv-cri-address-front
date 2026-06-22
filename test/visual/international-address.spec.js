import { test } from "@playwright/test";
import {
  CountryPage,
  InternationalAddressPage,
  NonUKConfirmPage,
} from "../browser/pages/index.js";
import { getStartingURL } from "../browser/support/journey-setup.js";
import assert from "node:assert";
import { takeAndCompareScreenshots } from "./helper/screenshot-config.js";

test("Happy path international address", async ({ page }) => {
  const startingUrl = await getStartingURL("international-address");
  await page.goto(startingUrl.toString());

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
