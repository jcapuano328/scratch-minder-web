'use strict'
var config = require('config'),
    fetch = require('node-fetch'),
    jwt = require('jsonwebtoken'),
    log = require('../lib/log');

module.exports = [
    {
        method: 'post',
        uri: '/login',
        protected: false,
        handler: (req,res,next) => {
            log.debug('Login User');
            return new Promise((resolve,reject) => {
                if (!req.body.username || !req.body.password) {
                    log.error('Credentials misssing');
                    return reject('Credentials misssing');
                }
                resolve({username: req.body.username, password: req.body.password});
            })
            .then((credentials) => {
                let username = credentials.username;
                let password = credentials.password;
                log.trace('Authenticate User ' + username);
                let url = config.services.host + config.services.authlogin;
                let body = {username: username, password: password};
                log.trace('Post to auth services: ' + url);
                return fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                })
                .then((response) => {
                    //log.trace(response.status);
                    if (response.status != 200) {
                        throw response.statusText;
                    }
                    return response.json();
                })
                .then((user) => {
                    log.trace('User ' + user.username + ' authenticated');
                    let url = config.services.host + config.services.authgrant;
                    log.trace('Post to auth services: ' + url);
                    let body = 'grant_type=password&username='+user.username+'&password='+password;
                    return fetch(url, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: body
                    })
                    .then((response) => {
                        if (response.status != 201) {
                            throw response.statusText;
                        }
                        return response.json();
                    })
                    .then((authtoken) => {
                        let token = authtoken.access_token;
                        log.trace(token);
                        log.trace('Generate the JWT');
                        return new Promise((resolve,reject) => {
                            jwt.sign({user: user, token: token}, config.session.secret, {}, resolve);
                        });
                    });
                });
            })
            .then((jwttoken) => {
                log.debug('Authentication succeeded');
                log.trace(jwttoken);
                res.status(200).send(jwttoken);
            })
            .catch((err) => {
                log.error('Authentication failed: Token invalid. ' + err);
                return res.status(401).send(err);
            });
        }
    },
    {
        method: 'post',
        uri: '/logout',
        protected: false,
        handler: (req,res,next) => {

            return next();
        }
    }

];
