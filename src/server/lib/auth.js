'use strict'
var config = require('config'),
    fetch = require('node-fetch'),
    log = require('../lib/log');

module.exports = (restricted) => {
    return (req,res,next) => {
        if (!restricted) {
            next && next();
            return Promise.accept(true);
        }

        if (!req.token) {
            log.error('Authentication failed: Token missing');
            res.status(401).send('Invalid credentials');
            return Promise.reject(false);
        }

        // validate token with service
        log.trace('Verify Token: ' + req.token);
        let url = config.services.host + config.services.authverify; //url.resolve(config.services.host, config.services.auth)
        return fetch(url, {method: 'POST', body: {access_token: req.token}})
        .then((res) => {
            if (res.status != 200) {
                throw response.statusText;
            }
            log.trace('Token verified: ' + req.token);
            next && next();
        })
        .catch((err) => {
            log.error('Authentication failed: Token invalid');
            return res.status(401).send('Token invalid');
        });
    }
}
