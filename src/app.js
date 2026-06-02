import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import DynamoDBStoreFactory from "connect-dynamodb";

import { frontendUiMiddlewareIdentityBypass } from "@govuk-one-login/frontend-ui";
import addLanguageParam from "@govuk-one-login/frontend-language-toggle";
import { frontendVitalSignsInitFromApp } from "@govuk-one-login/frontend-vital-signs";

import commonExpress from "@govuk-one-login/di-ipv-cri-common-express";

import { previousRouter } from "./app/address/routes/previous/index.js";
import { addressRouter } from "./app/address/routes/address/index.js";
import { summaryRouter } from "./app/address/routes/summary/index.js";

import { missingRedirectErrorHandler } from "./middleware/missingRedirectErrorHandler.js";

import { setAPIConfig, setOAuthPaths } from "./lib/settings.js";
import { config } from "./lib/config.js";

const DynamoDBStore = DynamoDBStoreFactory(session);

const { setup } = commonExpress.bootstrap;
const setHeaders = commonExpress.lib.headers;
const setScenarioHeaders = commonExpress.lib.scenarioHeaders;
const setAxiosDefaults = commonExpress.lib.axios;
const { setGTM, setLanguageToggle, setDeviceIntelligence } =
  commonExpress.lib.settings;
const { getGTM, getLanguageToggle, getDeviceIntelligence } =
  commonExpress.lib.locals;
const { setI18n } = commonExpress.lib.i18n;
const helmetConfig = commonExpress.lib.helmet;

const loggerConfig = {
  console: true,
  consoleJSON: true,
  consoleLevel: config.LOG_LEVEL,
  appLevel: config.LOG_LEVEL,
  app: false,
};

const dynamodb = new DynamoDB({
  region: "eu-west-2",
});

const dynamoDBSessionStore = new DynamoDBStore({
  client: dynamodb,
  table: config.SESSION_TABLE_NAME,
});

const sessionConfig = {
  cookieName: "service_session",
  cookieOptions: { maxAge: config.SESSION_TTL },
  secret: config.SESSION_SECRET,
  ...(config.SESSION_TABLE_NAME && { sessionStore: dynamoDBSessionStore }),
};

const { app, router } = setup({
  config: { APP_ROOT: import.meta.dirname },
  port: false, /// Disabling the bootstrap starting the server.
  logs: loggerConfig,
  session: sessionConfig,
  redis: config.SESSION_TABLE_NAME ? false : commonExpress.lib.redis(),
  helmet: helmetConfig,
  urls: {
    public: "/public",
  },
  publicDirs: ["../dist/public"],
  translation: {
    allowedLangs: ["en", "cy"],
    fallbackLang: ["en"],
  },
  views: [
    path.resolve(
      path.dirname(
        fileURLToPath(
          import.meta.resolve("@govuk-one-login/di-ipv-cri-common-express")
        )
      ),
      "components"
    ),
    path.resolve("node_modules/@govuk-one-login/"),
    "views",
  ],
  middlewareSetupFn: (app) => {
    frontendVitalSignsInitFromApp(app, {
      interval: 60000,
      logLevel: "info",
      metrics: [
        "requestsPerSecond",
        "avgResponseTime",
        "maxConcurrentConnections",
        "eventLoopDelay",
        "eventLoopUtilization",
      ],
      staticPaths: [
        /^\/assets\/.*/,
        "/ga4-assets",
        "/javascript",
        "/javascripts",
        "/images",
        "/stylesheets",
      ],
    });
    app.use(setHeaders);
    app.use((req, res, next) => {
      res.locals.query = req.query; // Makes ?edit=true available as query.edit
      next();
    });
  },
  overloadProtection: config.OVERLOAD_PROTECTION,
  dev: true,
});

app.set("view engine", "njk");

setI18n({
  router,
  config: {
    secure: true,
    cookieDomain: config.APP.FRONTEND_DOMAIN,
  },
});

// Common express relies on 0/1 strings
const showLanguageToggle =
  config.APP.LANGUAGE_TOGGLE_DISABLED === "true" ? "0" : "1";
setLanguageToggle({ app, showLanguageToggle });
app.get("nunjucks").addGlobal("addLanguageParam", addLanguageParam);

setDeviceIntelligence({
  app,
  deviceIntelligenceEnabled: config.APP.DEVICE_INTELLIGENCE_ENABLED,
  deviceIntelligenceDomain: config.APP.DEVICE_INTELLIGENCE_DOMAIN,
});

setAPIConfig({
  app,
  baseUrl: config.API.BASE_URL,
  sessionPath: config.API.PATHS.SESSION,
  authorizationPath: config.API.PATHS.AUTHORIZATION,
});

setOAuthPaths({ app, entryPointPath: config.APP.PATHS.ADDRESS });

setGTM({
  app,
  analyticsCookieDomain: config.APP.FRONTEND_DOMAIN,
  uaEnabled: config.APP.GTM.UA_ENABLED,
  uaContainerId: config.APP.GTM.UA_CONTAINER_ID,
  ga4Enabled: config.APP.GTM.GA4_ENABLED,
  ga4ContainerId: config.APP.GTM.GA4_CONTAINER_ID,
  analyticsDataSensitive: config.APP.GTM.ANALYTICS_DATA_SENSITIVE,
  ga4PageViewEnabled: true,
  ga4FormResponseEnabled: true,
  ga4FormErrorEnabled: true,
  ga4FormChangeEnabled: true,
  ga4NavigationEnabled: true,
  ga4SelectContentEnabled: true,
});

router.use(getGTM);
router.use(getLanguageToggle);
router.use(frontendUiMiddlewareIdentityBypass);
router.use(getDeviceIntelligence);

router.use(setScenarioHeaders);
router.use(setAxiosDefaults);

router.use("/oauth2", commonExpress.routes.oauth2);

router.use("/previous", previousRouter);
router.use("/", addressRouter);
router.use("/summary", summaryRouter);

router.use("^/$", (req, res) => {
  res.render("index");
});

router.use(commonExpress.lib.errorHandling.redirectAsErrorToCallback);
router.use(missingRedirectErrorHandler);

/* Server configuration */
const server = app.listen(config.PORT);

// AWS recommends the keep-alive duration of the target is longer than the idle timeout value of the load balancer (default 60s)
// to prevent possible 502 errors where the target connection has already been closed
// https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-troubleshooting.html#http-502-issues
server.keepAliveTimeout = 65000;

// Handles graceful shutdown of the NODE service, so that if the container is killed by a SIGTERM, it finishes processing existing connections before the server shuts down.
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close((err) => {
    if (err) {
      console.log(
        `Error while calling server.close() occurred: ${err.message}`
      );
    } else {
      console.log("HTTP server closed");
    }

    process.exit(0);
  });
});
