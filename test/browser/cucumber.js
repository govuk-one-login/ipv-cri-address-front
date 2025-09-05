module.exports = {
  default: {
    paths: ["./features/**/**.feature"],
    require: ["./support/**/*.js", "./step_definitions/**/*.js"],
    format: [
      "progress",
      "json:reports/cucumber-report.json",
      "html:reports/index.html",
    ],
  },
};
