module.exports = {
  default: {
    publishQuiet: true,
    paths: ["./features/**/**.feature"],
    require: ["./support/**/*.js", "./step_definitions/**/*.js"],
    format: [
      "progress-bar",
      "json:reports/cucumber-report.json",
      "html:reports/index.html",
    ],
  },
};
