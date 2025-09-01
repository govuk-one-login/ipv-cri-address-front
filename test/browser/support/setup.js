const {
  Before,
  BeforeAll,
  AfterAll,
  After,
  setDefaultTimeout,
} = require("@cucumber/cucumber");
const { chromium } = require("playwright");

// FIXME This is large due to cold starts
setDefaultTimeout(30 * 1000);

BeforeAll(async function () {
  // Browsers are expensive in Playwright so only create 1
  global.browser = process.env.GITHUB_ACTIONS
    ? await chromium.launch()
    : await chromium.launch({
        headless: false,
        // Slow so we can see things happening
        slowMo: 500,
      });
});

AfterAll(async function () {
  await global.browser.close();
});

// Extract client_id from scenario tags for Imposter
Before(async function ({ pickle } = {}) {
  if (!(process.env.MOCK_API === "true")) {
    return;
  }

  const tags = pickle.tags || [];
  const tag = tags.find((tag) => tag.name.startsWith("@mock-api:"));

  if (!tag) {
    return;
  }

  // Extract client_id from @mock-api:scenario-name tag
  const clientId = tag?.name.substring(10);
  this.clientId = clientId;
});

// Create a new test context and page per scenario
Before(async function () {
  this.context = await global.browser.newContext({});
  this.page = await this.context.newPage();
});

// Cleanup after each scenario
After(async function () {
  await this.page.close();
  await this.context.close();
});
