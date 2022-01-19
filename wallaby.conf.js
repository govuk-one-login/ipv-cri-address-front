module.exports = function (wallaby) {
  return {
    files: [
      "!src/**/*.test.js",
      "src/**/*.js",
      "test/utils/**/*.js",
      ".mocharc.yaml",
    ],

    tests: [
      "src/**/*.test.js", // adjust if required
    ],

    env: {
      type: "node",
    },

    testFramework: "mocha",
    setup: function () {
      // throws if not present
      var mocha = wallaby.testFramework;
      mocha.timeout(1000);
      mocha.ui("bdd");
      require("./test/utils/mocha-helpers");
      mocha.suite.afterEach(() => {
        sinon.restore();
      });
    },
  };
};
