import fetch from 'node-fetch';
import UrlPattern from 'url-pattern';
import auth from '../services/AuthService';
import {BASE_URL, TRANSACTIONS_URL, TRANSACTION_URL, TRANSACTIONS_SEARCH_URL, TRANSACTIONS_SUMMARY_URL} from '../constants/RESTConstants';
var _ = require('lodash');

let toJson = (response) => {
    if (response.status != 200) {
        throw {status: response.status, message: response.statusText};
    }
    return response.json();
};

let TransactionsService = {
    getAll(accountid) {
        let token = auth.getToken();
        let pattern = new UrlPattern(TRANSACTIONS_URL);
        let url = BASE_URL + pattern.stringify({id: accountid});
        //let url = BASE_URL + TRANSACTIONS_URL.replace(':id', accountid);
        return fetch(url, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(toJson);
    },
    get(accountid, transactionid) {
        let token = auth.getToken();
        let pattern = new UrlPattern(TRANSACTION_URL);
        let url = BASE_URL + pattern.stringify({id: accountid, transactionid: transactionid});
        //let url = BASE_URL + TRANSACTION_URL.replace(':id', accountid).replace(':transactionId', transactionid);
        return fetch(url, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(toJson);
    },
    save(accountid, transaction, isnew) {
        let token = auth.getToken();
        let pattern = new UrlPattern(isnew ? TRANSACTIONS_URL: TRANSACTION_URL);
        let url = BASE_URL + pattern.stringify({id: accountid, transactionid: transaction.transactionid});
        let method = isnew ? 'post' : 'put';
        return fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(transaction)
        })
        .then((response) => {
            if (response.status != 200 && response.status != 201) {
                throw {status: response.status, message: response.statusText};
            }
            return response.json();
        });
    },
    remove(accountid, transaction) {
        let token = auth.getToken();
        let pattern = new UrlPattern(TRANSACTION_URL);
        let url = BASE_URL + pattern.stringify({id: accountid, transactionid: transaction.transactionid});
        return fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(toJson);
    },
    search(accountid, kindof, searchtxt) {
        let token = auth.getToken();
        let pattern = new UrlPattern(TRANSACTIONS_SEARCH_URL);
        let url = BASE_URL + pattern.stringify({id: accountid, kind: kindof, search: searchtxt});
        return fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(toJson);
    },
    summary(accountid, startdate, enddate, groupby) {
        let token = auth.getToken();
        let pattern = new UrlPattern(TRANSACTIONS_SUMMARY_URL);
        let url = BASE_URL + pattern.stringify({id: accountid, startdate: startdate.toISOString(), enddate: enddate.toISOString()});
        return fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(toJson)
        .then((data) => {
            let o = {
                transactions: data
            };
            if (groupby) {
                let g = _.groupBy(data, groupby);
                o.summary = _.map(g, (v,k) => {
                    let s = {};
                    s[groupby] = k;
                    s.total = _.reduce(v, (sum, n) => {
                        return sum + parseFloat(n.amount);
                    }, 0);
                    return s;
                });
            }
            return o;
        });
    }
};

module.exports = TransactionsService;
