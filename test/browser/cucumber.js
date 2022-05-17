module.exports = {
  default: {
    publishQuiet: true,
    paths: ["./test/browser/features/**/**.feature"],
    require: [
      "./test/browser/support/**/*.js",
      "./test/browser/step_definitions/**/*.js",
    ],
  },
};
