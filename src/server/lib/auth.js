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

        if (!req.user || !req.user.token) {
            log.error('Authentication failed: Token missing');
            res.status(401).send('Invalid credentials');
            return Promise.reject(false);
        }
        let token = req.user.token;

        // validate token with service
        log.trace('Verify Token: ' + token);
        let url = config.services.host + config.services.auth.verify; //url.resolve(config.services.host, config.services.auth.verify)
        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({access_token: token})
        })
        .then((res) => {
            if (res.status != 200) {
                throw response.statusText;
            }
            log.trace('Token verified: ' + token);
            next && next();
        })
        .catch((err) => {
            log.error('Authentication failed: Token invalid');
            return res.status(401).send('Token invalid');
        });
    }
}
