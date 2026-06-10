import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    globals: true,
    include: ["src/**/*.test.js"],
    env: { USE_PINO_LOGGER: "true" },
    coverage: {
      provider: "v8",
      reporters: ["text", "lcov"],
      exclude: ["test/**"],
    },
  },
});
