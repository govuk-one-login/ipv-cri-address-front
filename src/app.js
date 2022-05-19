const setScenarioHeaders = require("./common/lib/scenario-headers");
const setAxiosDefaults = require("./common/lib/axios");

const { setAPIConfig, setOAuthPaths } = require("./lib/settings");

const { API, APP, PORT, SESSION_SECRET, REDIS } = require("./lib/config");

const { setup } = require("hmpo-app");

const loggerConfig = {
  console: true,
  consoleJSON: true,
  app: false,
};

const redisConfig = require("./common/lib/redis")(REDIS);

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
  authorizePath: API.PATHS.AUTHORIZE,
});

setOAuthPaths({ app, entryPointPath: APP.PATHS.ADDRESS });

router.use(setScenarioHeaders);
router.use(setAxiosDefaults);

router.use("/oauth2", require("./common/routes/oauth2"));

router.use("/", require("./app/address"));

router.use("^/$", (req, res) => {
  res.render("index");
});
