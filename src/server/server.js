'use strict'
var config = require('config'),
    express = require('express'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    bearerToken = require('express-bearer-token'),
    path = require('path'),
    _ = require('lodash'),
    SessionConnection = require('./lib/session-connection'),
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
        app.use(bearerToken());
        // Set as our static content dir
        app.use('/', express.static(path.join(__dirname, 'content')));

        return SessionConnection.connect()
        .then((db) => {
            // session
            app.use(session(_.extend(config.session, {
                resave: false,
                saveUninitialized: false,
                store: new MongoStore({db: db})
            })));

            // register routes
            return Router.register(app)
            .then(() => {
                server = app.listen(port, () => {
                    log.debug('Server started');
                });
            });
        })
        .catch((err) => {
            log.error(err);
            SessionConnection.disconnect().catch(() => {});
            throw err;
        });
    },
    stop() {
        if (server) {
            log.info('Stopping Server');
            server.close(() => {
                SessionConnection.disconnect();
                log.debug('Server stopped');
                server = null;
            });
        }
    }
};
