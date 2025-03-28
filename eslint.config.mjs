import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import mocha from "eslint-plugin-mocha";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    "**/wallaby.conf.js",
    "**/node_modules",
    "**/reports",
    "**/.aws-sam",
    "**/dist",
  ]),
  {
    extends: compat.extends(
      "prettier",
      "eslint:recommended",
      "plugin:prettier/recommended"
    ),

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
        sinon: true,
        expect: true,
        setupDefaultMocks: true,
      },
    },

    rules: {
      "no-console": 2,

      "padding-line-between-statements": [
        "error",
        {
          blankLine: "any",
          prev: "*",
          next: "*",
        },
      ],
    },
  },
  {
    files: ["src/**/*.test.js"],
    extends: compat.extends("plugin:mocha/recommended"),

    plugins: {
      mocha,
    },

    rules: {
      "mocha/no-mocha-arrows": 0,
      "mocha/no-setup-in-describe": 0,
    },
  },
]);
