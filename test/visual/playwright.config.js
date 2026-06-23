import { defineConfig } from "playwright/test";

export default defineConfig({
  testDir: ".",
  snapshotDir: "./snapshots",
  workers: 1,
  use: {
    baseUrl: process.env.EXTERNAL_WEBSITE_HOST || "http://localhost:5010",
    headless: true,
    launchOptions: {
      args: ["--no-sandbox"],
    },
  },
});
