const {
  Before,
  BeforeAll,
  AfterAll,
  After,
  setDefaultTimeout,
} = require("@cucumber/cucumber");
const { chromium, firefox, webkit } = require("playwright");

// FIXME This is large due to cold starts
setDefaultTimeout(30 * 1000);

const browserTypes = {
  chromium,
  firefox,
  webkit,
  //local only
  edge: {
    launch: (options) => chromium.launch({ ...options, channel: "msedge" }),
  },
};

BeforeAll(async function () {
  // Browsers are expensive in Playwright so only create 1
  const browserName = process.env.BROWSER || "chromium";
  const browserType = browserTypes[browserName];

  if (!browserType) throw new Error(`Unsupported browser: ${browserName}`);

  // eslint-disable-next-line no-console
  console.log(`Running scenarios in browser type: ${browserName}`);
  global.browser = await browserType.launch({
    headless: false,
    slowMo: process.env.GITHUB_ACTIONS ? 0 : 500,
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
  this.context = await global.browser.newContext({
    ignoreHTTPSErrors: true,
  });
  this.context.on("response", async (response) => {
    const headers = response.headers();
    if (headers["set-cookie"]) {
      const cookies = await this.context.cookies();
      await this.context.addCookies(
        cookies.map((cookie) => ({ ...cookie, secure: false }))
      );
    }
  });
  this.page = await this.context.newPage();
});

// Cleanup after each scenario
After(async function () {
  await this.page.close();
  await this.context.close();
});
