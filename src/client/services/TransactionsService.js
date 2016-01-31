import fetch from 'node-fetch';
import UrlPattern from 'url-pattern';
import auth from '../services/AuthService';
import {BASE_URL, TRANSACTIONS_URL,TRANSACTION_URL} from '../constants/RESTConstants';

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
        .then(function(response) {
            if (response.status != 200) {
                throw {status: response.status, message: response.statusText};
            }
            return response.json();
        });
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
        .then(function(response) {
            if (response.status != 200) {
                throw {status: response.status, message: response.statusText};
            }
            return response.json();
        });
    },
    save(accountid, transaction) {
        let token = auth.getToken();
        let pattern = new UrlPattern(!transaction.transactionid ? TRANSACTIONS_URL: TRANSACTION_URL);
        let url = BASE_URL + pattern.stringify({id: accountid, transactionid: transaction.transactionid});
        let method = !transaction.transactionid ? 'post' : 'put';
        return fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(transaction)
        })
        .then(function(response) {
            if (response.status != 200 && response.status != 201) {
                throw {status: response.status, message: response.statusText};
            }
            return response.json();
        });
    }
};

module.exports = TransactionsService;
