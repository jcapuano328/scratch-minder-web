import React from 'react';
import { Link } from 'react-router';
import auth from '../services/AuthService';

let Home = React.createClass({
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
    
    render() {
        if (this.state.loggedIn) {
            return <h1>Home</h1>
        }
        return (
            <div>
                <h1>Welcome!</h1>
                <p>
                    Please <Link to="/login">Sign in</Link> or <Link to="/signup">Sign up</Link> to get started!
                </p>
            </div>
        );
    }
});

module.exports = Home;
