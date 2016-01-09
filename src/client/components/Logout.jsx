import React from 'react';
import { History } from 'react-router'
import Auth from '../services/AuthService'

let Logout = React.createClass({
    mixins: [ History ],
    
    componentDidMount() {
        Auth.logout()
        .then(() => {
            this.history.replaceState(null, '/');
        });
    },

    render() {
        //return <p>You are now logged out</p>
        return <div>Logging off...</div>
    }
});

module.exports = Logout;
