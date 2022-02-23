module.exports = {
  extends: "../../.eslintrc.js",
  rules: {
    "no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        varsIgnorePattern: "Given|And|When|Then",
      },
    ],
  },
};
