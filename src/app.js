require("dotenv").config();

const { setup } = require("hmpo-app");

const loggerConfig = {
  console: true,
  consoleJSON: true,
  app: false,
};

const redisConfig = require("./lib/redis")();

const sessionConfig = {
  cookieName: "service_session",
  secret: process.env.SESSION_SECRET,
};

const { router } = setup({
  config: { APP_ROOT: __dirname },
  port: process.env.PORT || 5000,
  logs: loggerConfig,
  session: sessionConfig,
  redis: redisConfig,
  urls: {
    public: "/public",
  },
  publicDirs: ["../dist/public"],
  dev: true,
});

router.get("/", (req, res) => {
  res.render("index");
});
