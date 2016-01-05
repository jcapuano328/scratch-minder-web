import fetch from 'node-fetch';
import {LOGIN_URL, SIGNUP_URL} from '../constants/LoginConstants';

let handleAuth = (loginPromise) => {
    return loginPromise
    .then(function(response) {
        return response.text();
    });
}

let AuthService = {

    login(username, password) {
        return new Promise((resolve,reject) => {
            if (!username || !password) {
                return reject('Invalid credentials');
            }
            resolve();
        })
        .then(() => {
            return handleAuth(fetch(LOGIN_URL, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                })
            }));            
        })
        .then((jwt) => {
            localStorage.setItem('jwt', jwt);
            this.onChange(true);
        })
        .catch((err) => {
            this.onChange(false);
        });
    },

    logout() {
        return new Promise((resolve,reject) => {
            this.onChange(false);
            localStorage.removeItem('jwt');
            resolve();
        });
    },

    /*
    signup(username, password, extra) {
        return this.handleAuth(fetch(SIGNUP_URL, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password,
                extra: extra
            })
        }));
    },*/

    getToken() {
        return localStorage.getItem('jwt');
    },

    loggedIn() {
        return !!this.getToken();
    },

    onChange() {}
};

module.exports = AuthService;
