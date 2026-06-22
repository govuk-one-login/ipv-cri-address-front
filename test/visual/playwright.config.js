import { defineConfig } from "playwright/test";
import baseConfig from "../../playwright.config.js";

export default defineConfig({
  ...baseConfig,
  testDir: ".",
  snapshotDir: "./snapshots",
  workers: 1,
  use: {
    ...baseConfig.use,
    baseUrl: process.env.EXTERNAL_WEBSITE_HOST || "http://localhost:5010",
    headless: false,
  }
})
