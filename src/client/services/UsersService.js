import fetch from 'node-fetch';
import auth from '../services/AuthService';
import UrlPattern from 'url-pattern';
import {BASE_URL, USERS_URL, USER_URL} from '../constants/RESTConstants';

let UsersService = {
    getAll() {
        let token = auth.getToken();
        return fetch(BASE_URL + USERS_URL, {
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
    get(userid) {
        let token = auth.getToken();
        let pattern = new UrlPattern(!!userid ? USER_URL : USERS_URL);
        let url = BASE_URL + pattern.stringify({id: userid});
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
    save(user, isnew) {
        let token = auth.getToken();
        let pattern = new UrlPattern(isnew ? USERS_URL: USER_URL);
        let url = BASE_URL + pattern.stringify({id: user.userid});
        let method = isnew ? 'post' : 'put';
        return fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(user)
        })
        .then(function(response) {
            if (response.status != 200 && response.status != 201) {
                throw {status: response.status, message: response.statusText};
            }
            return response.json();
        });
    },
    remove(user) {
        let token = auth.getToken();
        let pattern = new UrlPattern(USER_URL);
        let url = BASE_URL + pattern.stringify({id: user.userid});
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

module.exports = UsersService;
