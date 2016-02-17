'use strict'
var config = require('config'),
    fetch = require('node-fetch'),
    UrlPattern = require('url-pattern'),
    log = require('../lib/log');

module.exports = [
    {
        method: 'get',
        uri: '/accounts',
        protected: true,
        handler: (req,res,next) => {
            log.info('Fetching accounts for ' + req.user.user.username);
            let pattern = new UrlPattern(config.services.accounts.accounts);
            let url = config.services.host + pattern.stringify({userid: req.user.user.userid});
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
            .then((accounts) => {
                accounts = accounts || [];
                log.trace(accounts.length + ' accounts retrieved');
                res.status(200).send(accounts);
            })
            .catch((err) => {
                log.error('Accounts retrieval for ' + req.user.user.username + ' failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    },
    {
        method: 'get',
        uri: '/accounts/:id',
        protected: true,
        handler: (req,res,next) => {
            //console.dir(req.user.user);
            log.info('Fetching account ' + req.params.id + ' for ' + req.user.user.username);
            let pattern = new UrlPattern(config.services.accounts.account);
            let url = config.services.host + pattern.stringify({userid: req.user.user.userid, id: req.params.id});
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
            .then((account) => {
                log.trace('Account retrieved');
                res.status(200).send(account);
            })
            .catch((err) => {
                log.error('Account retrieval for ' + req.user.user.username + ' failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    },
    {
        method: 'post',
        uri: '/accounts',
        protected: true,
        handler: (req,res,next) => {
            log.info('Creating account for ' + req.user.user.username);
            let pattern = new UrlPattern(config.services.accounts.accounts);
            let url = config.services.host + pattern.stringify({userid: req.user.user.userid});
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
            .then((accounts) => {
                log.trace('Account created');
                res.status(201).send(accounts);
            })
            .catch((err) => {
                log.error('Account creation for ' + req.user.user.username + ' failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    },
    {
        method: 'put',
        uri: '/accounts/:id',
        protected: true,
        handler: (req,res,next) => {
            log.info('Updating account ' + req.params.id + ' for ' + req.user.user.username);
            let pattern = new UrlPattern(config.services.accounts.account);
            let url = config.services.host + pattern.stringify({userid: req.user.user.userid, id: req.params.id});
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
            .then((account) => {
                log.trace('Account updated');
                res.status(200).send(account);
            })
            .catch((err) => {
                log.error('Account update for ' + req.user.user.username + ' failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    },
    {
        method: 'delete',
        uri: '/accounts/:id',
        protected: true,
        handler: (req,res,next) => {
            log.info('Removing account ' + req.params.id + ' for ' + req.user.user.username);
            let pattern = new UrlPattern(config.services.accounts.account);
            let url = config.services.host + pattern.stringify({userid: req.user.user.userid, id: req.params.id});
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
            .then((account) => {
                log.trace('Account removed');
                res.status(200).send(account);
            })
            .catch((err) => {
                log.error('Account removal for ' + req.user.user.username + ' failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    }
];
