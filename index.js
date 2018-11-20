'use strict';

var express = require('express');
var kraken = require('kraken-js');
const mongoUtil = require('./utils/mongo');

var options, app;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
    onconfig: function (config, next) {
        mongoUtil.connectToServer(config.get('mongo:key'), config.get('mongo:url'), () => {
          next(null, config);
        });
    }
};

app = module.exports = express();
app.use(kraken(options));

app.on('start', function () {
  console.log('Application ready to serve requests.');
  console.log('Environment: %s', app.kraken.get('env:env'));
});
