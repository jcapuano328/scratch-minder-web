import fetch from 'node-fetch';
import auth from '../services/AuthService';
import {ACCOUNTS_URL, ACCOUNT_URL} from '../constants/RESTConstants';

let AccountsService = {
    get(accountid) {
        let token = auth.getToken();
        let url = !!accountid ? ACCOUNT_URL.replace(':id', accountid) : ACCOUNTS_URL;
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
    }
};

module.exports = AccountsService;
