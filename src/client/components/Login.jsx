import React from 'react';
import { History } from 'react-router'
import { Paper, TextField, RaisedButton, Snackbar } from 'material-ui';
import Auth from '../services/AuthService'

let Login = React.createClass({
    mixins: [ History ],

    getInitialState() {
        return {
            user: '',
            password: '',
            loggedIn: Auth.loggedIn(),
            statusMessage: '',
            statusMessageDuration: 5000
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
        let self = this;
        e.preventDefault();
        let user = this.refs.user.getValue();
        let pass = this.refs.pass.getValue();

        Auth.login(user, pass)
        .then(() => {
            self.history.replaceState(null, '/');
        })
        .catch(function(err) {
            let msg = 'Logon Error: ' + (err.message || err);
            self.setState({statusMessage: msg});
            console.error(msg, err);
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
                          hintText="Enter Username"
                          floatingLabelText="Username"
                          type="text" />
                    </div>

                    <div>
                        <TextField
                          ref="pass"
                          hintText="Enter Password"
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
                    <Snackbar
                      open={!!this.state.statusMessage}
                      message={this.state.statusMessage}
                      autoHideDuration={this.state.statusMessageDuration}
                      onRequestClose={() => {
                          this.setState({statusMessage: ''});
                      }}
                    />
                </form>
            </Paper>
        );
    }
});

module.exports = Login;
