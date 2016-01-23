import React from 'react';
import { Paper, Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle, IconButton, Snackbar } from 'material-ui';
import auth from '../services/AuthService';
import acctService from '../services/AccountsService';
import transService from '../services/TransactionsService';

let Transactions = React.createClass({
    getInitialState() {
        return {
            user: auth.getUser().user,
            account: '',
            transactions: []
        };
    },
    componentDidMount() {
        acctService.get(this.state.user.preferredAccount)
        .then((account) => {
            this.setState({account: account.number});
            this.onRefresh();
        })
        .catch((err) => {
            // show the snackbar?
            console.error(err);
        });
    },

    onRefresh() {
        return transService.get(this.state.user.preferredAccount)
        .then((transactions) => {
            this.setState({transactions: transactions});
        })
        .catch((err) => {
            // show the snackbar?
            console.error(err);
        });
    },

    onAdd() {

    },
    onDelete() {

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
                             <ToolbarTitle text={this.state.account.toString()} />
                        </ToolbarGroup>
                        <ToolbarGroup float="right">
                            <ToolbarTitle text="Actions" />
                            <IconButton
                                tooltip='Add'
                                tooltipPosition='top-left'
                                iconClassName='fa fa-plus-square-o'
                                onTouchTap={this.onAdd}
                                />
                            <ToolbarSeparator />
                            <IconButton
                                tooltip='Delete'
                                tooltipPosition='top-left'
                                iconClassName='fa fa-minus-square-o'
                                onTouchTap={this.onDelete}
                                />
                            <ToolbarSeparator />
                            <IconButton
                                tooltip='Refresh'
                                tooltipPosition='top-left'
                                iconClassName='fa fa-refresh'
                                onTouchTap={this.onRefresh}
                                />

                        </ToolbarGroup>
                    </Toolbar>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHeaderColumn tooltip="Transaction Date">Date</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Transaction ID">ID</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Transaction Name">Name</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Transaction Category">Category</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Transaction Credit Amount">Credit</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Transaction Debit Amount">Debit</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Account Balance">Balance</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody
                            stripedRows={true}>
                            {(this.state.transactions || []).map(this.makeTransaction)}
                        </TableBody>
                    </Table>
                </form>

            </Paper>
        );
    },

    makeTransaction(transaction) {
        return (
            <TableRow key={transaction.transactionid}>
                <TableRowColumn>{transaction.when}</TableRowColumn>
                <TableRowColumn>{transaction.sequence}</TableRowColumn>
                <TableRowColumn>{transaction.description}</TableRowColumn>
                <TableRowColumn>{transaction.category}</TableRowColumn>
                <TableRowColumn>{transaction.type == 'credit' || transaction.type == 'set' ? transaction.amount : ''}</TableRowColumn>
                <TableRowColumn>{transaction.type == 'debit' ? transaction.amount : ''}</TableRowColumn>
                <TableRowColumn>Balance!</TableRowColumn>
            </TableRow>
        );
    }
});

module.exports = Transactions;
