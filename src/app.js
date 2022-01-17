const { PORT, SESSION_SECRET } = require("./lib/config");
const { setup } = require("hmpo-app");

const loggerConfig = {
  console: true,
  consoleJSON: true,
  app: false,
};

const redisConfig = require("./lib/redis")();

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

router.use("/oauth2", require("./app/oauth2"));

router.use("^/$", (req, res) => {
  res.render("index");
});
