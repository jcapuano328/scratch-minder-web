import React from 'react';
import { History } from 'react-router'
import { Paper, TextField, RaisedButton } from 'material-ui';
import Auth from '../services/AuthService'

let Login = React.createClass({
    mixins: [ History ],

    getInitialState() {
        return {
            user: '',
            password: '',
            loggedIn: Auth.loggedIn()
        }
    },

    componentWillMount() {
        if (this.state.loggedIn) {
            this.history.replaceState(null, '/');
        }
    },

    componentDidMount() {
        this.refs.user.focus();
    },

    login(e) {
        e.preventDefault();
        let user = this.refs.user.getValue();
        let pass = this.refs.pass.getValue();

        Auth.login(user, pass)
        .then(() => {
            this.history.replaceState(null, '/');
        })
        .catch(function(err) {
            alert("There's an error logging in");
            console.log("Error logging in", err);
        });
    },

    render() {
        return (
            <Paper
                style={{
                    width: 380,
                    height: '50%',
                    margin: '4em auto'
                }}
                zDepth={3}
            >
                <form onSubmit={this.login}
                    style={{
                        textAlign: 'center'
                    }}>
                    <div>
                        <TextField
                          ref="user"
                          hintText="Username Field"
                          floatingLabelText="Username"
                          type="text" />
                    </div>

                    <div>
                        <TextField
                          ref="pass"
                          hintText="Password Field"
                          floatingLabelText="Password"
                          type="password" />
                    </div>
                    <div
                        style={{
                            marginTop: 25,
                            marginBottom: 25
                        }}
                    >
                        <RaisedButton type='submit' label="Sign In" primary={true} />
                    </div>
                </form>
            </Paper>
        );
    }
});

module.exports = Login;
