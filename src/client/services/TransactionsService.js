import fetch from 'node-fetch';
import auth from '../services/AuthService';
import {TRANSACTIONS_URL} from '../constants/RESTConstants';

let TransactionsService = {
    get(accountid) {
        let token = auth.getToken();
        let url = TRANSACTIONS_URL.replace(':id', accountid);                
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

module.exports = TransactionsService;
