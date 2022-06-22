require("express");
require("express-async-errors");

const path = require("path");

const commonExpress = require("di-ipv-cri-common-express");

const setScenarioHeaders = commonExpress.lib.scenarioHeaders;
const setAxiosDefaults = commonExpress.lib.axios;

const { setAPIConfig, setOAuthPaths } = require("./lib/settings");

const { API, APP, PORT, SESSION_SECRET, REDIS } = require("./lib/config");

const { setup } = require("hmpo-app");

const loggerConfig = {
  console: true,
  consoleJSON: true,
  app: false,
};

const redisConfig = commonExpress.lib.redis(REDIS);

const sessionConfig = {
  cookieName: "service_session",
  secret: SESSION_SECRET,
};

const { app, router } = setup({
  config: { APP_ROOT: __dirname },
  port: PORT,
  logs: loggerConfig,
  session: sessionConfig,
  redis: redisConfig,
  urls: {
    public: "/public",
  },
  publicDirs: ["../dist/public"],
  views: [
    path.resolve(
      path.dirname(require.resolve("di-ipv-cri-common-express")),
      "components"
    ),
    "views",
  ],
  dev: true,
});

app.get("nunjucks").addGlobal("getContext", function () {
  return {
    keys: Object.keys(this.ctx),
    ctx: this.ctx.ctx,
  };
});

setAPIConfig({
  app,
  baseUrl: API.BASE_URL,
  sessionPath: API.PATHS.SESSION,
  authorizationPath: API.PATHS.AUTHORIZATION,
});

setOAuthPaths({ app, entryPointPath: APP.PATHS.ADDRESS });

router.use(setScenarioHeaders);
router.use(setAxiosDefaults);

router.use("/oauth2", commonExpress.routes.oauth2);

router.use("/previous", require("./app/address/routes/previous"));
router.use("/", require("./app/address/routes/address"));
router.use("/summary", require("./app/address/routes/summary"));

router.use("^/$", (req, res) => {
  res.render("index");
});
