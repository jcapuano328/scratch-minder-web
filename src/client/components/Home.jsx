import React from 'react';
import { Link, History } from 'react-router';
import auth from '../services/AuthService';
import usersService from '../services/UsersService';

let Home = React.createClass({
    mixins: [ History ],

    getInitialState() {
        return {
            loggedIn: auth.loggedIn(),
            user: null,
            statusMessage: '',
            statusMessageDuration: 5000
        };
    },

    /*
    updateAuth(loggedIn, user) {
        this.setState({
            loggedIn: loggedIn,
            user: user
        });
    },
    */
    componentWillMount() {
        if (this.state.loggedIn) {
            let usr = auth.getUser().user;
            return usersService.get(usr.userid)
            .then((user) => {
                this.setState({user: user});
            })
            .catch((err) => {
                this.setState({statusMessage: err.message || err});
                console.error(err);
            });
        }
    },

    welcomeView() {
        return (
            <div>
                <h1>Welcome!</h1>
                <p>
                    Please <Link to="/login">Sign in</Link> or <Link to="/signup">Sign up</Link> to get started!
                </p>
                <Snackbar
                  open={!!this.state.statusMessage}
                  message={this.state.statusMessage}
                  autoHideDuration={this.state.statusMessageDuration}
                  onRequestClose={() => {
                      this.setState({statusMessage: ''});
                  }}
                />
            </div>
        );
    },

    render() {
        if (this.state.loggedIn) {
            if (this.state.user && this.state.user.preferredAccount) {
                this.history.replaceState(null, '/account/' + this.state.user.preferredAccount + '/transactions');
            }
            return <h1>Home</h1>
        }
        return this.welcomeView();
    }
});

module.exports = Home;
