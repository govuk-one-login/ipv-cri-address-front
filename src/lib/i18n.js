const i18next = require("i18next");
const Backend = require("i18next-sync-fs-backend");

// const interpolation = require("./interpolation");

i18next.use(Backend).init({
  initImmediate: false,
  lng: "en",
  fallbackLng: "en",
  preload: ["en"],
  nsSeparator: "::",
  defaultNS: "default",
  ns: ["default", "fields", "pages"],
  backend: {
    loadPath: "./locales/{{lng}}/{{ns}}.yaml",
  },
});

module.exports = i18next;
