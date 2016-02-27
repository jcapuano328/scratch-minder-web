'use strict'
var config = require('config'),
    fetch = require('node-fetch'),
    UrlPattern = require('url-pattern'),
    log = require('../lib/log');

module.exports = [
    {
        method: 'get',
        uri: '/users',
        protected: true,
        handler: (req,res,next) => {
            log.info('Fetching users');
            let url = config.services.host + config.services.users.users;
            log.debug('GET ' + url);
            return fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + req.user.token
                }
            })
            .then((response) => {
                //log.trace(response.status);
                if (response.status != 200) {
                    throw {status: response.status, message: response.statusText};
                }
                return response.json();
            })
            .then((users) => {
                users = users || [];
                log.trace(users.length + ' users retrieved');
                res.status(200).send(users);
            })
            .catch((err) => {
                log.error('Users retrieval failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    },
    {
        method: 'get',
        uri: '/users/:id',
        protected: true,
        handler: (req,res,next) => {
            log.info('Fetching user ' + req.params.id);
            let pattern = new UrlPattern(config.services.users.user);
            let url = config.services.host + pattern.stringify({id: req.params.id});
            log.debug('GET ' + url);
            return fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + req.user.token
                }
            })
            .then((response) => {
                //log.trace(response.status);
                if (response.status != 200) {
                    throw {status: response.status, message: response.statusText};
                }
                return response.json();
            })
            .then((user) => {
                log.trace('User retrieved');
                res.status(200).send(user);
            })
            .catch((err) => {
                log.error('User retrieval failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    },
    {
        method: 'post',
        uri: '/users',
        protected: true,
        handler: (req,res,next) => {
            log.info('Creating user');
            let url = config.services.host + config.services.users.users;
            log.debug('POST ' + url);
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + req.user.token
                },
                body: JSON.stringify(req.body)
            })
            .then((response) => {
                //log.trace(response.status);
                if (response.status != 201) {
                    throw {status: response.status, message: response.statusText};
                }
                return response.json();
            })
            .then((users) => {
                log.trace('User created');
                res.status(201).send(users);
            })
            .catch((err) => {
                log.error('User creation failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    },
    {
        method: 'put',
        uri: '/users/:id',
        protected: true,
        handler: (req,res,next) => {
            log.info('Updating user ' + req.params.id);
            let pattern = new UrlPattern(config.services.users.user);
            let url = config.services.host + pattern.stringify({id: req.params.id});
            log.debug('PUT ' + url);
            return fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + req.user.token
                },
                body: JSON.stringify(req.body)
            })
            .then((response) => {
                //log.trace(response.status);
                if (response.status != 200) {
                    throw {status: response.status, message: response.statusText};
                }
                return response.json();
            })
            .then((user) => {
                log.trace('User updated');
                res.status(200).send(user);
            })
            .catch((err) => {
                log.error('User update failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    },
    {
        method: 'delete',
        uri: '/users/:id',
        protected: true,
        handler: (req,res,next) => {
            log.info('Removing user ' + req.params.id);
            let pattern = new UrlPattern(config.services.users.user);
            let url = config.services.host + pattern.stringify({id: req.params.id});
            log.debug('DELETE ' + url);
            return fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + req.user.token
                }
            })
            .then((response) => {
                //log.trace(response.status);
                if (response.status != 200) {
                    throw {status: response.status, message: response.statusText};
                }
                return response.json();
            })
            .then((user) => {
                log.trace('User removed');
                res.status(200).send(user);
            })
            .catch((err) => {
                log.error('User removal failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    },
    {
        method: 'put',
        uri: '/users/:id/reset',
        protected: true,
        handler: (req,res,next) => {
            log.info('Resetting user password ' + req.params.id);
            let pattern = new UrlPattern(config.services.users.resetpassword);
            let url = config.services.host + pattern.stringify({id: req.params.id});
            log.debug('PUT ' + url);
            return fetch(url, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + req.user.token
                },
                body: JSON.stringify(req.body)
            })
            .then((response) => {
                //log.trace(response.status);
                if (response.status != 200) {                    
                    throw {status: response.status, message: response.statusText};
                }
                return response.json();
            })
            .then((user) => {
                log.trace('User password reset');
                res.status(200).send(user);
            })
            .catch((err) => {
                log.error('User password reset failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    }
];
