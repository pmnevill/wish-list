'use strict';
var express = require('express');
var kraken = require('kraken-js');
const mongoUtil = require('./utils/mongo');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('./utils/passport');

var options, app;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
  onconfig: function (config, next) {
    mongoUtil.connectToServer(config.get('mongo:url'), config.get('mongo:srv'), process.env.MONGO_USER, process.env.MONGO_PASS, () => {
      next(null, config);
    });
  }
};

app = module.exports = express();
app.use(kraken(options));
// app.use(cors());
app.use(cookieParser());
// config express-session
var sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true
};
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

app.on('start', function () {
  console.log('Application ready to serve requests.');
  console.log('Environment: %s', app.kraken.get('env:env'));
});
