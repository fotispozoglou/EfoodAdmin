const rateLimit = require("express-rate-limit");
const MongoStore = require("rate-limit-mongo");

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const dbUrl = IS_PRODUCTION ? process.env.MONGO_URL : process.env.DEV_MONGO_URL;

const renderLimiter = rateLimit({
  store: new MongoStore({
    uri: dbUrl,
    user: "",
    password: "",
    expireTimeMs: 60 * 60 * 1000,
    errorHandler: console.error.bind(null, "rate-limit-mongo"),
  }),
  max: 300,
  windowMs: 60 * 60 * 1000,
});

const loginLimiter = rateLimit({
  store: new MongoStore({
    uri: dbUrl,
    user: "",
    password: "",
    expireTimeMs: 60 * 60 * 1000,
    errorHandler: console.error.bind(null, "rate-limit-mongo"),
  }),
  max: 4,
  windowMs: 60 * 60 * 1000,
});

module.exports = {
  renderLimiter,
  loginLimiter,
};
