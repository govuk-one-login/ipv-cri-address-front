const {
  Before,
  BeforeAll,
  AfterAll,
  After,
  setDefaultTimeout,
} = require("@cucumber/cucumber");
const { chromium } = require("playwright");
const axios = require("axios");
const {default: AxeBuilder} = require("@axe-core/playwright");

// FIXME This is large due to cold starts
setDefaultTimeout(30 * 1000);

// HOOKS
// Multiple Before hooks are executed in the order that they were defined.
// Multiple After hooks are executed in the reverse order that they were defined.

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

  await axios.get(`${process.env.MOCK_API_URL}/__reset/${header}`);
});

// Create a new test context
Before(async function () {
  this.context = await global.browser.newContext({});
});

// Add scenario headers if required
Before(async function () {
  if (!this.SCENARIO_ID_HEADER) {
    return;
  }
  await this.context.setExtraHTTPHeaders({
    "x-scenario-id": this.SCENARIO_ID_HEADER,
  });
});

const evntFunction = (pageFromLoadEvent) => {
  console.log(`page from load event: ${pageFromLoadEvent.url()}`);

    // const results = await new AxeBuilder({ page: this.page }).analyze();
    // console.log(Object.keys(results)); // eslint-disable-line
    // console.log(results.violations[0]); // eslint-disable-line
};

// Setup accessibility if required
Before(async function () {
  if (!(process.env.TEST_ACCESSIBILITY === "true")) {
    return;
  }

  this.context.on("page", (pageFromContextEvent) => {
    console.log(`page from event: ${pageFromContextEvent.url()}`);

    pageFromContextEvent.on("load", evntFunction);

    pageFromContextEvent.on("close", (pageFromCloseEvent) => {
      pageFromCloseEvent.off("load", evntFunction);
    });
  });
});

// Create new page
Before(async function () {
  this.page = await this.context.newPage();
});

// Cleanup after each scenario
After(async function () {
  await this.page.close();
  await this.context.close();
});
