import React from 'react';
import { History } from 'react-router'
import { Paper, MenuItem, TextField, IconButton, FlatButton, Snackbar,
         Toolbar, ToolbarGroup, ToolbarTitle  } from 'material-ui';
import {FormattedNumber} from 'react-intl';
import acctService from '../services/AccountsService';

let AccountDetail = React.createClass({
    mixins: [ History ],

    getInitialState() {
        return {
            name: null,
            number: null,
            sequence: null,
            balance: 0,
            isnew: (this.props.params.accountId == 'new')
        };
    },

    componentWillMount() {
        acctService.get(this.props.params.accountId)
        .then((account) => {
            this.setState({
                name: account.name,
                number: account.number,
                sequence: account.sequence,
                balance: account.lastActivity.balance || 0,
                account: account
            });
        })
        .catch((err) => {
            // show the snackbar?
            console.error(err);
        });
    },

    onChangeName(e) {
        this.setState({name: e.target.value});
    },
    onChangeNumber(e) {
        this.setState({number: e.target.value});
    },
    onChangeSequence(e) {
        this.setState({sequence: e.target.value});
    },
    onChangeBalance(e) {
        if (!isNaN(parseFloat(e.target.value))) {
            this.setState({balance: e.target.value});
        }
    },
    onOk(e) {
        // call the service to save the data
        this.state.account.name = this.state.name;
        this.state.account.number = this.state.number;
        this.state.account.sequence = this.state.sequence;
        this.state.account.lastActivity.balance = this.state.balance;

        acctService.save(this.state.account,this.state.isnew)
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
                             <ToolbarTitle text={'Account Profile'}/>
                        </ToolbarGroup>
                        {
                            (this.props.params.accountId != 'new')
                            ? (
                            <ToolbarGroup float="left" style={{top: '32%', left: '20%', color: 'green'}}>
                                 <FormattedNumber
                                     floatingLabelText='Balance'
                                     hintText='Current balance'
                                     value={this.state.balance} format="USD" />
                            </ToolbarGroup>
                            )
                            : (
                            <ToolbarGroup />
                            )
                        }
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
                        </ToolbarGroup>
                    </Toolbar>
                    <div style={{textAlign: 'center'}}>
                        <div>
                            <TextField value={this.state.name}
                                onChange={this.onChangeName}
                                floatingLabelText="Name"
                                hintText='Name of account'/>
                        </div>
                        <div>
                            <TextField value={this.state.number}
                                onChange={this.onChangeNumber}
                                floatingLabelText="Number"
                                hintText='Number of Account'/>
                        </div>
                        <div>
                            <TextField value={this.state.sequence}
                                onChange={this.onChangeSequence}
                                floatingLabelText="Sequence"
                                hintText='Next value in sequence'/>
                        </div>
                        <div style={{marginBottom: 25}}>
                            {
                                (this.props.params.accountId == 'new')
                                ? (
                                    <TextField value={this.state.balance}
                                        onChange={this.onChangeBalance}
                                        floatingLabelText="Balance"
                                        hintText='Account balance'/>
                                )
                                : (
                                    <div />
                                )
                            }
                        </div>
                    </div>
                </form>
            </Paper>
        );
    }
});

module.exports = AccountDetail;
