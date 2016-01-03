'use strict'
var config = require('config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    jwt = require('express-jwt'),
    path = require('path'),
    _ = require('lodash'),
    Router = require('./lib/router'),
    log = require('./lib/log');

var server;

module.exports = {
    start() {
        let port = process.env.PORT || config.port || 4000;
        log.info('Starting server on port ' + port);

        // create app
        let app = express();
        // parse application/x-www-form-urlencoded
        app.use(bodyParser.urlencoded({ extended: false }))
        // parse application/json
        app.use(bodyParser.json())
        // parse cookies
        app.use(cookieParser(config.session.secret, config.session.cookie));
        // parse auth token
        app.use(jwt({secret: config.session.secret, credentialsRequired: false}));
        // Set as our static content dir
        app.use('/', express.static(path.join(__dirname, 'content')));

        // register routes
        return Router.register(app)
        .then(() => {
            return new Promise((resolve,reject) => {
                server = app.listen(port, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        })
        .then(() => {
            log.debug('Server started on port ' + port);
        })
        .catch((err) => {
            log.error(err);
            throw err;
        });
    },
    stop() {
        if (server) {
            log.info('Stopping Server');
            server.close(() => {
                log.debug('Server stopped');
                server = null;
            });
        }
    }
};
