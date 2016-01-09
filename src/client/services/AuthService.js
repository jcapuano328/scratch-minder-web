import fetch from 'node-fetch';
import {LOGIN_URL, SIGNUP_URL} from '../constants/LoginConstants';
import jwtDecode from 'jwt-decode';

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
            this.onChange(true, jwtDecode(jwt));
        })
        .catch((err) => {
            this.onChange(false);
        });
    },

    logout() {
        return new Promise((resolve,reject) => {
            localStorage.removeItem('jwt');
            this.onChange(false);
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

    getUser() {
        let token = this.getToken();
        if (token) {
            return jwtDecode(token);
        }
        return {};
    },

    loggedIn() {
        return !!this.getToken();
    },

    isInRole(roles) {
        roles = typeof roles === 'array' ? roles : [roles];
        let user = this.getUser();
        return roles.some((role) => {
            let uroles = user.user.roles || [];
            return uroles.indexOf(role) >= 0;
        });
    },

    onChange() {}
};

module.exports = AuthService;
