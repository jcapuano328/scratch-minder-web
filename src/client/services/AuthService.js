import fetch from 'node-fetch';
import {LOGIN_URL, SIGNUP_URL} from '../constants/LoginConstants';
import LoginActions from '../actions/LoginActions';

class AuthService {

    login(username, password) {
        return this.handleAuth(fetch(LOGIN_URL, {
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
    }

    logout() {
        LoginActions.logoutUser();
    }

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
    }

    handleAuth(loginPromise) {
        return loginPromise
        .then(function(response) {
            return response.text();
        })
        .then((jwt) => {            
            LoginActions.loginUser(jwt);
            return true;
        });
    }
}

export default new AuthService()
