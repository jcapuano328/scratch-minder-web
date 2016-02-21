import React from 'react';
import { History } from 'react-router'
import { Paper, SelectField, MenuItem, TextField, IconButton, Snackbar,
         Toolbar, ToolbarGroup, ToolbarTitle, ToolbarSeparator } from 'material-ui';
import auth from '../services/AuthService';
import userService from '../services/UsersService';
import acctService from '../services/AccountsService';

let UserProfile = React.createClass({
    mixins: [ History ],

    getInitialState() {
        return {
            user: {},
            first: '',
            last: '',
            email: '',
            accounts: [],
            preferredAccount: ''
        };
    },

    componentWillMount() {
        let usr = auth.getUser().user;
        return userService.get(usr.userid)
        .then((user) => {
            this.setState({
                user: user,
                first: user.firstname,
                last: user.lastname,
                email: user.email,
                preferredAccount: user.preferredAccount
            });
            return acctService.getAll();
        })
        .then((accounts) => {
            this.setState({
                accounts: accounts
            });
        })
        .catch((err) => {
            // show the snackbar?
            console.error(err);
        });
    },

    onChangeFirstName(e) {
        this.setState({first: e.target.value});
    },
    onChangeLastName(e) {
        this.setState({last: e.target.value});
    },
    onChangeEmail(e) {
        this.setState({email: e.target.value});
    },
    onChangePreferred(e,i,v) {
        this.setState({preferredAccount: v});
    },
    onResetPassword() {
        console.log('reset password');
    },
    onOk(e) {
        // call the service to save the data
        this.state.user.firstname = this.state.first;
        this.state.user.lastname = this.state.last;
        this.state.user.email = this.state.email;
        this.state.user.preferredAccount = this.state.preferredAccount;

        userService.save(this.state.user)
        .then(() => {
            this.history.goBack();
        })
        .catch((err) => {
            console.error(err);
            // show the snack bar?
            //this.history.goBack();
        });
    },
    onCancel(e) {
        this.history.goBack();
    },

    render() {
        return (
            <Paper
                style={{
                    width: '50%',
                    height: '100%',
                    margin: '1.5em auto'
                }}
                zDepth={2}
            >
                <form>
                    <Toolbar>
                        <ToolbarGroup float="left">
                             <ToolbarTitle text={'Profile'}/>
                        </ToolbarGroup>
                        <ToolbarGroup float="right">
                            <IconButton
                                tooltip='Accept'
                                tooltipPosition='top-left'
                                iconClassName='fa fa-check'
                                onTouchTap={this.onOk}
                            />
                            <IconButton
                                tooltip='Discard'
                                tooltipPosition='top-left'
                                iconClassName='fa fa-times'
                                onTouchTap={this.onCancel}
                            />
                            <ToolbarSeparator />
                        </ToolbarGroup>
                        <ToolbarGroup float="right">
                            <IconButton
                                tooltip='Reset Password'
                                tooltipPosition='top-left'
                                iconClassName='fa fa-lock'
                                onTouchTap={this.onResetPassword}
                            />
                        </ToolbarGroup>

                    </Toolbar>
                    <div style={{textAlign: 'center'}}>
                        <div>
                            <TextField value={this.state.first}
                                onChange={this.onChangeFirstName}
                                floatingLabelText="First Name"
                                hintText='User First Name'/>
                        </div>
                        <div>
                            <TextField value={this.state.last}
                                onChange={this.onChangeLastName}
                                floatingLabelText="Last Name"
                                hintText='User Last Name'/>
                        </div>
                        <div>
                            <TextField value={this.state.email}
                                type="Email"
                                onChange={this.onChangeEmail}
                                floatingLabelText="Email Address"
                                hintText='User Email Address'/>
                        </div>
                        <div style={{marginBottom: 25}}>
                            <SelectField value={this.state.preferredAccount}
                                onChange={this.onChangePreferred}
                                floatingLabelText="Preferred Account"
                                hintText='User Preferred Account'>
                                {this.state.accounts.map((acct,i) => {
                                    return (
                                        <MenuItem key={acct.accountid} value={acct.accountid} primaryText={acct.name + ' - ' + acct.number}/>
                                    );
                                })}
                            </SelectField>
                        </div>
                    </div>
                </form>
            </Paper>
        );
    }
});

module.exports = UserProfile;
