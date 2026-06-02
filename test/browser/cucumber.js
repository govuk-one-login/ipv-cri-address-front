export default {
  paths: ["./features/**/**.feature"],
  import: ["./support/**/*.js", "./step_definitions/**/*.js"],
  format: [
    "progress",
    "json:reports/cucumber-report.json",
    "html:reports/index.html",
  ],
};
