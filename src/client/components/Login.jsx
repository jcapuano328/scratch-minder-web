import React from 'react';
import { History } from 'react-router'
import Auth from '../services/AuthService'

let Login = React.createClass({
    mixins: [ History ],

    getInitialState() {
        return {
            user: '',
            password: ''
        }
    },

    login(e) {
        e.preventDefault();
        let user = this.refs.user.value;
        let pass = this.refs.pass.value;

        Auth.login(user, password)
        .then(() => {
            const { location } = this.props
            if (location.state && location.state.nextPathname) {
                this.history.replaceState(null, location.state.nextPathname)
            } else {
                this.history.replaceState(null, '/')
            }
        })
        .catch(function(err) {
            alert("There's an error logging in");
            console.log("Error logging in", err);
        });
    },

    render() {
        return (
            <div className="login jumbotron center-block">
                <h1>Login</h1>
                <form role="form" onSubmit={this.login}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input ref="user" type="text" className="form-control" id="username" placeholder="Username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input ref="pass" type="password" className="form-control" id="password" placeholder="Password" />
                    </div>
                    <button type="submit" className="btn btn-default">Submit</button>
                </form>
            </div>
        );
    }
});

module.exports = Login;
