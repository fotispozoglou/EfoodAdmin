const rateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');

const dbUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/efood';

const renderLimiter = rateLimit({
  store: new MongoStore({
    uri: dbUrl,
    user: '',
    password: '',
    expireTimeMs: 60 * 60 * 1000,
    errorHandler: console.error.bind(null, 'rate-limit-mongo')
  }),
  max: 300,
  windowMs: 60 * 60 * 1000
});

const loginLimiter = rateLimit({
  store: new MongoStore({
    uri: dbUrl,
    user: '',
    password: '',
    expireTimeMs: 60 * 60 * 1000,
    errorHandler: console.error.bind(null, 'rate-limit-mongo')
  }),
  max: 4,
  windowMs: 60 * 60 * 1000
});

module.exports = {
  renderLimiter,
  loginLimiter
};