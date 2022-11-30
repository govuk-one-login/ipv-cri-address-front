const {
  Before,
  BeforeAll,
  AfterAll,
  After,
  setDefaultTimeout,
} = require("@cucumber/cucumber");
const { chromium } = require("playwright");
const axios = require("axios");

// FIXME This is large due to cold starts
setDefaultTimeout(30 * 1000);

BeforeAll(async function () {
  // Browsers are expensive in Playwright so only create 1
  global.browser = process.env.GITHUB_ACTIONS
    ? await chromium.launch()
    : await chromium.launch({
        // Not headless so we can watch test runs
        headless: false,
        // Slow so we can see things happening
        slowMo: 500,
      });
});

AfterAll(async function () {
  await global.browser.close();
});

// Add scenario header
Before(async function ({ pickle } = {}) {
  if (!(process.env.MOCK_API === "true")) {
    return;
  }

  const tags = pickle.tags || [];
  const tag = tags.find((tag) => tag.name.startsWith("@mock-api:"));

  if (!tag) {
    return;
  }

  const header = tag?.name.substring(10);

  this.SCENARIO_ID_HEADER = header;

  try {
    await axios.get(`${process.env.API_BASE_URL}/__reset/${header}`);
  } catch (e) {
    /* eslint-disable no-console */
    console.log("Error resetting mock");
    console.log(`${process.env.API_BASE_URL}/__reset/${header}`);
    console.log(e.message);
    /* eslint-enable no-console */
    throw e;
  }
});

// Create a new test context and page per scenario
Before(async function () {
  this.context = await global.browser.newContext({});

  if (this.SCENARIO_ID_HEADER) {
    await this.context.setExtraHTTPHeaders({
      "x-scenario-id": this.SCENARIO_ID_HEADER,
    });
  }

  this.page = await this.context.newPage();
});

// Cleanup after each scenario
After(async function () {
  await this.page.close();
  await this.context.close();
});
