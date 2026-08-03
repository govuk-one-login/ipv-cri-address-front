import { test } from "@playwright/test";
import {
  AddressPage,
  ConfirmPage,
  ResultsPage,
  SearchPage,
} from "../browser/pages/index.js";
import assert from "node:assert";
import { takeAndCompareScreenshots } from "./helper/screenshot-config.js";
import { goToAddressStart } from "./helper/function-helper.js";

test("Error Validation - Search screen", async ({ page }) => {
  await goToAddressStart(page, "address-success");

  const searchPage = new SearchPage(page);
  assert.strictEqual(searchPage.isCurrentPage(), true);
  await searchPage.clickContinue();
  await takeAndCompareScreenshots(page, "search-validation");
});

test("Welsh Error Validation - Search screen", async ({ page }) => {
  await goToAddressStart(page, "address-success", "cy");

  const searchPage = new SearchPage(page);
  assert.strictEqual(searchPage.isCurrentPage(), true);
  await searchPage.clickContinue();
  await takeAndCompareScreenshots(page, "search-validation-cy");
});

test("Error Validation - UK Address form screen", async ({ page }) => {
  await goToAddressStart(page, "address-success");

  const searchPage = new SearchPage(page);
  assert.strictEqual(searchPage.isCurrentPage(), true);
  await searchPage.searchPostcode("E1 8QS");

  const resultsPage = new ResultsPage(page);
  assert.strictEqual(resultsPage.isCurrentPage(), true);
  await resultsPage.selectCantFindMyAddress();
  await resultsPage.continue();

  const addressPage = new AddressPage(page);
  assert.strictEqual(addressPage.isCurrentPage(), true);
  await addressPage.continue();
  await takeAndCompareScreenshots(page, "uk-address-validation");
});

test("Welsh Error Validation - UK Address form screen", async ({ page }) => {
  await goToAddressStart(page, "address-success", "cy");

  const searchPage = new SearchPage(page);
  assert.strictEqual(searchPage.isCurrentPage(), true);
  await searchPage.searchPostcode("E1 8QS");

  const resultsPage = new ResultsPage(page);
  assert.strictEqual(resultsPage.isCurrentPage(), true);
  await resultsPage.selectCantFindMyAddress();
  await resultsPage.continue();

  const addressPage = new AddressPage(page);
  assert.strictEqual(addressPage.isCurrentPage(), true);
  await addressPage.continue();
  await takeAndCompareScreenshots(page, "uk-address-validation-cy");
});

test("Error Validation - Confirm screen", async ({ page }) => {
  await goToAddressStart(page, "address-success");

  const searchPage = new SearchPage(page);
  assert.strictEqual(searchPage.isCurrentPage(), true);
  await searchPage.searchPostcode("E1 8QS");

  const resultsPage = new ResultsPage(page);
  assert.strictEqual(resultsPage.isCurrentPage(), true);
  await resultsPage.selectAddress();
  await resultsPage.continue();

  const addressPage = new AddressPage(page);
  assert.strictEqual(addressPage.isCurrentPage(), true);
  await addressPage.addYearFrom("recent");
  await addressPage.continue();

  const confirmPage = new ConfirmPage(page);
  assert.strictEqual(confirmPage.isCurrentPage(), true);
  await confirmPage.returnRadioLegend();
  await confirmPage.confirmDetails();
  await takeAndCompareScreenshots(page, "confirm-validation");
});

test("Welsh Error Validation - Confirm screen", async ({ page }) => {
  await goToAddressStart(page, "address-success", "cy");

  const searchPage = new SearchPage(page);
  assert.strictEqual(searchPage.isCurrentPage(), true);
  await searchPage.searchPostcode("E1 8QS");

  const resultsPage = new ResultsPage(page);
  assert.strictEqual(resultsPage.isCurrentPage(), true);
  await resultsPage.selectAddress();
  await resultsPage.continue();

  const addressPage = new AddressPage(page);
  assert.strictEqual(addressPage.isCurrentPage(), true);
  await addressPage.addYearFrom("recent");
  await addressPage.continue();

  const confirmPage = new ConfirmPage(page);
  assert.strictEqual(confirmPage.isCurrentPage(), true);
  await confirmPage.returnRadioLegend();
  await confirmPage.confirmDetails();
  await takeAndCompareScreenshots(page, "confirm-validation-cy");
});
