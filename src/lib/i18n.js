const i18next = require("i18next");
const Backend = require("i18next-sync-fs-backend");
const i18nextMiddleware = require("i18next-http-middleware");

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

var i18nextConfigurationOptions = {
  debug: true,
  initImmediate: false,
  supportedLngs: ["en", "cy"],
  // fallbackLng: ["en"],
  preload: ["en", "cy"],
  ns: ["default", "fields", "pages", "pages.errors"],
  nsSeparator: ".",
  returnEmptyString: true,
  defaultNS: "default",
  fallbackNS: ["fields", "pages", "pages.errors"],
  backend: {
    loadPath: "./src/locales/{{lng}}/{{ns}}.yml",
  },
  saveMissingTo: "current",
  detection: {
    order: ["querystring", "cookie"],
    caches: ["cookie"],
    cookieMinutes: 160,
    lookupQuerystring: "lng",
    lookupCookie: "lng",
  },
};

const configure = ({ app }) => {
  const configureI18next = (config) => {
    console.log(">>>>>>> configureI18next");

    const i18next = require("i18next");
    const Backend = require("i18next-sync-fs-backend");
    const i18nextMiddleware = require("i18next-http-middleware");

    i18next.use(Backend).use(i18nextMiddleware.LanguageDetector).init(config);

    return i18nextMiddleware.handle(i18next, {
      ignoreRoutes: ["/public"], // or function(req, res, options, i18next) { /* return true to ignore */ }
    });
  };
  // router.use(configureI18next(i18nextConfigurationOptions));
  app.use(configureI18next(i18nextConfigurationOptions));
  app.use((req, res, next) => {
    req.translate = req.i18n.getFixedT(req.i18n.language);
    next();
  });
};

module.exports = {
  i18next,
  configure,
};
