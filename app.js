if ( process.env.NODE_ENV !== "production" ) {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');

const Admin = require('./models/admin.js');

const MongoDBStore = require("connect-mongo");

// MONGO STUFF 
const dbUrl = 'mongodb://localhost:27017/efood-admin'; // process.env.DB_URL

const admins = require('./controllers/admins.js');

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// DEFINE APP ROUTES
const indexRoutes = require('./routes/index.js');
const adminRoutes = require('./routes/admins.js');
const { isAdmin } = require('./middlewares/admin.js');

// EJS STUFF
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret = 'thisshouldbeabettersecret!'; // process.env.SECRET

const sessionConfig = {
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store: MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
  })
}

app.use(session(sessionConfig));

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

app.use('/', indexRoutes);

app.get('/admin/login', admins.renderLogin );

app.use('/admin', adminRoutes);

// LISTEN

const port = process.env.PORT || 8080;

app.listen(port, () => {

  console.log("Admin Server Started");

});
