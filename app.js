if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const csrf = require("csurf");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const featurePolicy = require("feature-policy");
const getRawBody = require("raw-body");
const toobusy = require("toobusy-js");
const contentType = require("content-type");
const hpp = require("hpp");
const expectCt = require("expect-ct");

const Admin = require("./models/admin.js");

const MongoDBStore = require("connect-mongo");

const logger = require("./utils/logger.js");

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// MONGO STUFF
const dbUrl = IS_PRODUCTION ? process.env.MONGO_URL : process.env.DEV_MONGO_URL;

const admins = require("./controllers/admins.js");

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  logger.info("Admin Database Connected");
});

const csrfProtection = csrf();

module.exports.csrfProtection = csrfProtection;

// DEFINE APP ROUTES
const adminRoutes = require("./routes/admins.js");
const { isLoggedIn } = require("./middlewares/admin.js");
const { GENERAL } = require("./config/statusCodes.js");
const { renderLimiter } = require("./middlewares/limiters.js");
const { API_URL, SERVER_URL } = require("./config/config.js");

// EJS STUFF
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

app.use(hpp());
app.use(expectCt({ enforce: true, maxAge: 123 }));

const secret = process.env.SECRET || "thisisthesecret#!ASFR$";
const port = process.env.PORT || 8080;

app.set("trust proxy", 1);

const sessionConfig = {
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  store: MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
  }),
};

app.use(function (req, res, next) {
  if (toobusy()) {
    res.send(503, "Server Too Busy");
  } else {
    next();
  }
});

app.use(session(sessionConfig));

app.use(helmet());

const stylesSources = [""];

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", ...stylesSources],
      fontSrc: ["'self'"],
      connectSrc: ["'self'", `${API_URL}`],
    },
  })
);

app.use(
  helmet.dnsPrefetchControl({
    allow: false,
  })
);

app.use(
  helmet.frameguard({
    action: "deny",
  })
);

app.use(
  helmet.hsts({
    maxAge: 60 * 24 * 60 * 60,
  })
);

app.use(helmet.xssFilter());

app.use(helmet.hidePoweredBy({ setTo: "PHP 4.2.0" }));

app.use(
  featurePolicy({
    features: {
      accelerometer: ["'none'"],
      ambientLightSensor: ["'none'"],
      autoplay: ["'none'"],
      camera: ["'none'"],
      encryptedMedia: ["'none'"],
      fullscreen: ["'none'"],
      geolocation: ["'none"],
      gyroscope: ["'none'"],
      vibrate: ["'none'"],
      payment: ["'none"],
      syncXhr: ["'none'"],
    },
  })
);

// PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Admin.authenticate()));

passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get("/admin/login", renderLimiter, admins.renderLogin);

app.use("/admin", adminRoutes);

app.get("/*", renderLimiter, isLoggedIn, csrfProtection, (req, res) => {
  res.render("index", {
    csrfToken: req.csrfToken(),
    app: {
      enviroment: process.env.NODE_ENV,
      API_URL: API_URL,
      SERVER_URL: SERVER_URL,
    },
  });
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;

  if (!err.message) err.message = "Server Error";

  logger.error(err.stack);

  res.status(statusCode).send(JSON.stringify({ status: GENERAL.ERROR }));
});

// LISTEN

app.listen(port, () => {
  logger.info("Admin Server Started");
});
