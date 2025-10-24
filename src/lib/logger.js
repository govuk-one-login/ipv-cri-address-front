const pino = require("pino");
const { PACKAGE_NAME } = require("./config");

const logger = pino({
  name: PACKAGE_NAME,
  level: process.env.LOGS_LEVEL ?? "info",
  messageKey: "message", // rename default msg property to message,
  formatters: {
    level(label) {
      return { level: label.toUpperCase() };
    },
  },
});

module.exports = { logger };
