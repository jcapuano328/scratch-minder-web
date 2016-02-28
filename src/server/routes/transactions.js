'use strict'
var config = require('config'),
    fetch = require('node-fetch'),
    UrlPattern = require('url-pattern'),
    log = require('../lib/log');

module.exports = [
    {
        method: 'get',
        uri: '/accounts/:accountid/transactions',
        protected: true,
        handler: (req,res,next) => {
            log.info('Fetching transactions for ' + req.user.user.username + ' account ' + req.params.id);
            let pattern = new UrlPattern(config.services.transactions.transactions);
            let url = config.services.host + pattern.stringify({userid: req.user.user.userid, accountid: req.params.accountid});
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
            .then((transactions) => {
                transactions = transactions || [];
                log.trace(transactions.length + ' transactions retrieved');
                res.status(200).send(transactions);
            })
            .catch((err) => {
                log.error('Transactions retrieval for ' + req.user.user.username + ' failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    },
    {
        method: 'get',
        uri: '/accounts/:accountid/transactions/:id',
        protected: true,
        handler: (req,res,next) => {
            log.info('Fetching transactions for ' + req.user.user.username + ' account ' + req.params.accountid);
            let pattern = new UrlPattern(config.services.transactions.transaction);
            let url = config.services.host + pattern.stringify({userid: req.user.user.userid, accountid: req.params.accountid, id: req.params.id});
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
            .then((transaction) => {
                log.trace('Transaction retrieved');
                res.status(200).send(transaction);
            })
            .catch((err) => {
                log.error('Transaction retrieval for ' + req.user.user.username + ' failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    },
    {
        method: 'post',
        uri: '/accounts/:accountid/transactions',
        protected: true,
        handler: (req,res,next) => {
            log.info('Creating transaction for ' + req.user.user.username);
            let pattern = new UrlPattern(config.services.transactions.transactions);
            let url = config.services.host + pattern.stringify({userid: req.user.user.userid, accountid: req.params.accountid});
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
                log.trace('Transaction created');
                res.status(201).send(accounts);
            })
            .catch((err) => {
                log.error('Transaction creation for ' + req.user.user.username + ' failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    },
    {
        method: 'put',
        uri: '/accounts/:accountid/transactions/:id',
        protected: true,
        handler: (req,res,next) => {
            log.info('Updating transaction ' + req.params.id + ' for ' + req.user.user.username);
            let pattern = new UrlPattern(config.services.transactions.transaction);
            let url = config.services.host + pattern.stringify({userid: req.user.user.userid, accountid: req.params.accountid, id: req.params.id});
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
                log.trace('Transaction updated');
                res.status(200).send(account);
            })
            .catch((err) => {
                log.error('Transaction update for ' + req.user.user.username + ' failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    },
    {
        method: 'delete',
        uri: '/accounts/:accountid/transactions/:id',
        protected: true,
        handler: (req,res,next) => {
            log.info('Removing transaction ' + req.params.id + ' for ' + req.user.user.username);
            let pattern = new UrlPattern(config.services.transactions.transaction);
            let url = config.services.host + pattern.stringify({userid: req.user.user.userid, accountid: req.params.accountid, id: req.params.id});
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
            .then((transaction) => {
                log.trace('Transaction removed');
                res.status(200).send(transaction);
            })
            .catch((err) => {
                log.error('Transaction removal for ' + req.user.user.username + ' failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    },

    {
        method: 'get',
        uri: '/accounts/:accountid/transactions/search/:kind/:search',
        protected: true,
        handler: (req,res,next) => {
            log.info('Searching transactions for ' + req.user.user.username + ' account ' + req.params.accountid + ' for ' + req.params.kind + '/' + req.params.search);
            let pattern = new UrlPattern(config.services.transactions.transactionsearch);
            let url = config.services.host + pattern.stringify({userid: req.user.user.userid, accountid: req.params.accountid, kind: req.params.kind, search: req.params.search});
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
            .then((transactions) => {
                transactions = transactions || [];
                log.trace(transactions.length + ' transactions retrieved');
                res.status(200).send(transactions);
            })
            .catch((err) => {
                log.error('Transactions retrieval for ' + req.user.user.username + ' failed. ' + err.status + ' ' + err.message);
                return res.status(err.status || 400).send(err.message || err);
            });
        }
    }
];
