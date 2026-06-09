// playwright.setup.js
// @ts-check

/** @type {import('@playwright/test').PlaywrightTestConfig} */
export default {
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    channel: "chrome",
  },
};
