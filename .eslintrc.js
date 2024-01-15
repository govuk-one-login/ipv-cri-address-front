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
    "coverage",
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
};
