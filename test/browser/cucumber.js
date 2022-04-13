module.exports = {
  default: {
    publishQuiet: true,
    paths: ["./features/**/**.feature"],
    require: ["./support/**/*.js", "./step_definitions/**/*.js"],
  },
};
