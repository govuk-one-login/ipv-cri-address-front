import { test } from "@playwright/test";
import {
  AddressPage,
  ConfirmPage,
  ResultsPage,
  SearchPage,
} from "../browser/pages/index.js";
import { goToAddressStart } from "./helper/function-helper.js";
import assert from "node:assert";
import { takeAndCompareScreenshots } from "./helper/screenshot-config.js";

test("Happy path postcode lookup", async ({ page }) => {
  await goToAddressStart(page, "address-success");

  const searchPage = new SearchPage(page);
  assert.strictEqual(searchPage.isCurrentPage(), true);
  await takeAndCompareScreenshots(page, "search");
  await searchPage.searchPostcode("E1 8QS");

  const resultsPage = new ResultsPage(page);
  assert.strictEqual(resultsPage.isCurrentPage(), true);
  await takeAndCompareScreenshots(page, "results");
  await resultsPage.selectAddress();
  await resultsPage.continue();

  const addressPage = new AddressPage(page);
  assert.strictEqual(addressPage.isCurrentPage(), true);
  await takeAndCompareScreenshots(page, "uk-address");
  await addressPage.addYearFrom("recent");
  await addressPage.continue();

  const confirmPage = new ConfirmPage(page);
  assert.strictEqual(confirmPage.isCurrentPage(), true);
  await takeAndCompareScreenshots(page, "confirm");
  await confirmPage.returnRadioLegend();
  await confirmPage.selectYesRadioButton();
  await confirmPage.confirmDetails();
});

test("Happy path postcode lookup in Welsh", async ({ page }) => {
  await goToAddressStart(page, "address-success", "cy");

  const searchPage = new SearchPage(page);
  assert.strictEqual(searchPage.isCurrentPage(), true);
  await takeAndCompareScreenshots(page, "search-cy");
  await searchPage.searchPostcode("E1 8QS");

  const resultsPage = new ResultsPage(page);
  assert.strictEqual(resultsPage.isCurrentPage(), true);
  await takeAndCompareScreenshots(page, "results-cy");
  await resultsPage.selectAddress();
  await resultsPage.continue();

  const addressPage = new AddressPage(page);
  assert.strictEqual(addressPage.isCurrentPage(), true);
  await takeAndCompareScreenshots(page, "uk-address-cy");
  await addressPage.addYearFrom("recent");
  await addressPage.continue();

  const confirmPage = new ConfirmPage(page);
  assert.strictEqual(confirmPage.isCurrentPage(), true);
  await takeAndCompareScreenshots(page, "confirm-cy");
  await confirmPage.returnRadioLegend();
  await confirmPage.selectYesRadioButton();
  await confirmPage.confirmDetails();
});
