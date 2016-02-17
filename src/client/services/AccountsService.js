import fetch from 'node-fetch';
import auth from '../services/AuthService';
import UrlPattern from 'url-pattern';
import {BASE_URL, ACCOUNTS_URL, ACCOUNT_URL} from '../constants/RESTConstants';

let AccountsService = {
    getAll() {
        let token = auth.getToken();
        return fetch(BASE_URL + ACCOUNTS_URL, {
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
    get(accountid) {
        let token = auth.getToken();
        let pattern = new UrlPattern(!!accountid ? ACCOUNT_URL : ACCOUNTS_URL);
        let url = BASE_URL + pattern.stringify({id: accountid});
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
    save(account, isnew) {
        let token = auth.getToken();
        let pattern = new UrlPattern(isnew ? ACCOUNTS_URL: ACCOUNT_URL);
        let url = BASE_URL + pattern.stringify({id: account.accountid});
        let method = isnew ? 'post' : 'put';
        return fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(account)
        })
        .then(function(response) {
            if (response.status != 200 && response.status != 201) {
                throw {status: response.status, message: response.statusText};
            }
            return response.json();
        });
    },
    remove(account) {
        let token = auth.getToken();
        let pattern = new UrlPattern(ACCOUNT_URL);
        let url = BASE_URL + pattern.stringify({id: account.accountid});
        return fetch(url, {
            method: 'DELETE',
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
    }
};

module.exports = AccountsService;
