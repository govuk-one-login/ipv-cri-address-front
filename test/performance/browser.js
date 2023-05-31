import { chromium } from "k6/experimental/browser";
import { check } from "k6";

export default async function () {
  const browser = chromium.launch({
    headless: true,
  });
  const page = browser.newPage();

  try {
    await page.goto(
      "http://localhost:5010/oauth2/authorize?request=lorem&client_id=address-success"
    );

    await submitSearch(page);
    await submitResults(page);
    await submitAddress(page);
    await submitConfirm(page);
  } finally {
    page.close();
    browser.close();
  }
}

async function submitSearch(page) {
  page.locator('input[name="addressSearch"]').type("E1 8QS");
  const submitButton = page.locator("#continue");

  await Promise.all([page.waitForNavigation(), submitButton.click()]);
}

async function submitResults(page) {
  page
    .locator('select[name="addressResults"]')
    .selectOption("10 WHITECHAPEL HIGH STREET, LONDON, E1 8QS");

  const submitButton = page.locator("#continue");

  await Promise.all([page.waitForNavigation(), submitButton.click()]);
}

async function submitAddress(page) {
  page.locator('input[name="addressYearFrom"]').type("2000");

  const submitButton = page.locator("#continue");

  await Promise.all([page.waitForNavigation(), submitButton.click()]);
}

async function submitConfirm(page) {
  const submitButton = page.locator("data-id['next']");

  await Promise.all([page.waitForNavigation(), submitButton.click()]);
}
