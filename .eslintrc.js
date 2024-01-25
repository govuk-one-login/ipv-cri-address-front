module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    es2020: true,
    mocha: true,
  },
  globals: {
    sinon: true,
    expect: true,
    setupDefaultMocks: true,
  },
  extends: ["prettier", "eslint:recommended", "plugin:prettier/recommended"],
  ignorePatterns: [
    "wallaby.conf.js",
    "node_modules",
    "reports",
    ".aws-sam",
    "dist",
  ],
  rules: {
    "no-console": 2,
    "padding-line-between-statements": [
      "error",
      { blankLine: "any", prev: "*", next: "*" },
    ],
  },
  overrides: [
    {
      files: "src/**/*.test.js",
      plugins: ["mocha"],
      extends: ["plugin:mocha/recommended"],
      rules: {
        "mocha/no-mocha-arrows": 0,
        "mocha/no-setup-in-describe": 0,
      },
    },
  ],
};
