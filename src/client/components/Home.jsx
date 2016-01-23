import React from 'react';
import { Link, History } from 'react-router';
import auth from '../services/AuthService';

let Home = React.createClass({
    mixins: [ History ],

    getInitialState() {
        return {
            loggedIn: auth.loggedIn(),
            user: auth.getUser()
        };
    },

    /*
    updateAuth(loggedIn, user) {
        this.setState({
            loggedIn: loggedIn,
            user: user
        });
    },

    componentWillMount() {
        auth.onChange = this.updateAuth
        //auth.login()
    },
    */

    welcomeView() {
        return (
            <div>
                <h1>Welcome!</h1>
                <p>
                    Please <Link to="/login">Sign in</Link> or <Link to="/signup">Sign up</Link> to get started!
                </p>
            </div>
        );
    },

    render() {
        if (this.state.loggedIn) {
            if (this.state.user && this.state.user.user && this.state.user.user.preferredAccount) {
                this.history.replaceState(null, '/transactions');
            }
            return <h1>Home</h1>
        }
        return this.welcomeView();
    }
});

module.exports = Home;
