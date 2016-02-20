import React from 'react';
import { History } from 'react-router'
import { Paper, Snackbar, TextField, Toggle,
        Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn,
        Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle, IconButton
        } from 'material-ui';
import {FormattedDate,FormattedNumber} from 'react-intl';
import Pager from './Pager';
import ConfirmDialog from './ConfirmDialog';
import auth from '../services/AuthService';
import acctService from '../services/AccountsService';
import usersService from '../services/UsersService';

let Accounts = React.createClass({
    mixins: [ History ],

    getInitialState() {
        return {
            user: null,
            accounts: [],
            pagingOffset: 0,
            pagingTotal: 0,
            pagingLimit: 5,
            selectedAccount: null,
            showConfirm: false
        };
    },
    componentDidMount() {
        this.onRefresh();
    },

    onRefresh() {
        this.setState({accounts: []});
        let usr = auth.getUser().user;
        return usersService.get(usr.userid)
        .then((user) => {
            return acctService.getAll()
            .then((accounts) => {
                this.setState({
                    user: user,
                    accounts: accounts,
                    pagingOffset: 0,//accounts.length - this.state.pagingLimit,
                    pagingTotal: accounts.length
                });
            });
        })
        .catch((err) => {
            // show the snackbar?
            console.error(err);
        });
    },

    onAdd() {
        this.history.pushState(null, '/accounts/account/new');
    },
    onEdit() {
        if (this.state.selectedAccount != null) {
            this.history.pushState(null, '/accounts/account/' + this.state.selectedAccount.accountid);
        }
    },
    onDelete() {
        if (this.state.selectedAccount != null) {
            this.setState({showConfirm: true});
        }
    },

    onPageClick(offset) {
        this.setState({pagingOffset: offset});
    },

    onRowSelect(selectedRows) {
        let account = (selectedRows.length > 0) ? this.state.accounts[selectedRows[0]+this.state.pagingOffset] : null;
        this.setState({selectedAccount: account});
    },

    onPreferredSelected(row) {
        return (e, selected) => {
            let preferredAccount = this.state.user.preferredAccount;
            this.state.user.preferredAccount = selected ? this.state.accounts[row].accountid : null;
            usersService.save(this.state.user)
            .then(() => {
                this.setState({user: this.state.user});
            })
            .catch((err) => {
                // show the error?
                this.state.user.preferredAccount = preferredAccount;
                this.setState({user: this.state.user});
            });
        };
    },

    render() {
        return (
            <Paper
                style={{
                    width: '100%',
                    height: '100%',
                    margin: '1em auto'
                }}
                zDepth={2}
            >
                <form>
                    <Toolbar>
                        <ToolbarGroup float="left">
                             <ToolbarTitle text={'Accounts'} />
                        </ToolbarGroup>
                        <ToolbarGroup float="right">
                            <ToolbarTitle text="Actions" />
                            <IconButton
                                tooltip='Add'
                                tooltipPosition='top-left'
                                iconClassName='fa fa-plus-square-o'
                                onTouchTap={this.onAdd}
                                />
                            <IconButton
                                tooltip='Edit'
                                tooltipPosition='top-left'
                                iconClassName='fa fa-pencil-square-o'
                                disabled={!this.state.selectedAccount}
                                onTouchTap={this.onEdit}
                                />
                            <IconButton
                                tooltip='Delete'
                                tooltipPosition='top-left'
                                iconClassName='fa fa-minus-square-o'
                                disabled={!this.state.selectedAccount}
                                onTouchTap={this.onDelete}
                                />
                            <IconButton
                                tooltip='Refresh'
                                tooltipPosition='top-left'
                                iconClassName='fa fa-refresh'
                                onTouchTap={this.onRefresh}
                                />
                        </ToolbarGroup>
                    </Toolbar>
                    <Table onRowSelection={this.onRowSelect}>
                        <TableHeader displaySelectAll={false} enableSelectAll={false} adjustForCheckbox={true}>
                            <TableRow>
                                <TableHeaderColumn tooltip="Account Name">Name</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Account Number">Number</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Account Sequence">Sequence</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Account Balance">Balance</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Preferred Account">Preferred</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody stripedRows={true} displayRowCheckbox={true} deselectOnClickaway={false}>
                            {(this.state.accounts || []).slice(this.state.pagingOffset, this.state.pagingOffset+this.state.pagingLimit).map(this.makeAccount)}
                        </TableBody>
                        <Pager offset={this.state.pagingOffset} total={this.state.pagingTotal} limit={this.state.pagingLimit} onPageClick={this.onPageClick}/>
                    </Table>
                </form>
                <ConfirmDialog ref="confirmDlg" open={this.state.showConfirm} title={'Delete Account?'}
                    prompt={this.confirmPrompt(this.state.selectedAccount)}
                    onOk={() => {
                        acctService.remove(this.state.selectedAccount)
                        .then(() => {
                            this.setState({
                                selectedAccount: null,
                                showConfirm: false
                            });
                            this.onRefresh();
                        })
                        .catch((err) => {
                            // show the snackbar?
                            console.error(err);
                            this.setState({showConfirm: false});
                        });
                    }}
                    onCancel={() => {
                        this.setState({showConfirm: false});
                    }}
                />
            </Paper>
        );
    },

    makeAccount(account, i) {
        return (
            <TableRow key={account.accountid}
                selected={!!this.state.selectedAccount && this.state.selectedAccount.accountid==account.accountid}>
                <TableRowColumn>{account.name}</TableRowColumn>
                <TableRowColumn>{account.number}</TableRowColumn>
                <TableRowColumn>{account.sequence}</TableRowColumn>
                <TableRowColumn><FormattedNumber value={account.balance} format="USD" /></TableRowColumn>
                <TableRowColumn><Toggle defaultToggled={account.accountid==this.state.user.preferredAccount} onToggle={this.onPreferredSelected(i)}/></TableRowColumn>
            </TableRow>
        );
    },

    confirmPrompt(account) {
        if (!account) {
            return (<div/>);
        }

        return (
            <Table>
                <TableHeader displaySelectAll={false} enableSelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn tooltip="Account Name">Name</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Account Number">Number</TableHeaderColumn>
                        <TableHeaderColumn tooltip="Account Balance">Balance</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                        <TableRow key={account.accountid}>
                        <TableRowColumn>{account.name}</TableRowColumn>
                        <TableRowColumn>{account.number}</TableRowColumn>
                        <TableRowColumn><FormattedNumber value={account.balance} format="USD" /></TableRowColumn>
                    </TableRow>
                </TableBody>
            </Table>
        );
    }
});

module.exports = Accounts;
