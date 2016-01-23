import React from 'react';
import { Paper, Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle, IconButton, Snackbar } from 'material-ui';
import {FormattedDate,FormattedNumber} from 'react-intl';
import Pager from './Pager';
import auth from '../services/AuthService';
import acctService from '../services/AccountsService';
import transService from '../services/TransactionsService';

let Transactions = React.createClass({
    getInitialState() {
        return {
            user: auth.getUser().user,
            account: '',
            transactions: [],
            pagingOffset: 0,
            pagingTotal: 0,
            pagingLimit: 5
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
        this.setState({transactions: []});
        return transService.get(this.state.user.preferredAccount)
        .then((transactions) => {
            this.setState({transactions: transactions, pagingOffset: transactions.length - this.state.pagingLimit, pagingTotal: transactions.length});
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

    onPageClick(offset) {
        this.setState({pagingOffset: offset});
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
                             <ToolbarTitle text={'Account ' + this.state.account.toString()} />
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
                        <TableHeader enableSelectAll={true}>
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
                            {(this.state.transactions || []).slice(this.state.pagingOffset, this.state.pagingOffset+this.state.pagingLimit).map(this.makeTransaction)}
                        </TableBody>
                        <Pager offset={this.state.pagingOffset} total={this.state.pagingTotal} limit={this.state.pagingLimit} onPageClick={this.onPageClick}/>
                    </Table>
                </form>

            </Paper>
        );
    },

    makeTransaction(transaction) {
        let amount = (<FormattedNumber value={transaction.amount} format="USD" />);
        let balance = (<FormattedNumber value={0} format="USD" />);
        return (
            <TableRow key={transaction.transactionid}>
                <TableRowColumn><FormattedDate value={transaction.when} /></TableRowColumn>
                <TableRowColumn>{transaction.sequence}</TableRowColumn>
                <TableRowColumn>{transaction.description}</TableRowColumn>
                <TableRowColumn>{transaction.category}</TableRowColumn>
                <TableRowColumn>{transaction.type == 'credit' || transaction.type == 'set' ? amount : ''}</TableRowColumn>
                <TableRowColumn>{transaction.type == 'debit' ? amount : ''}</TableRowColumn>
                <TableRowColumn>{balance}</TableRowColumn>
            </TableRow>
        );
    }
});

module.exports = Transactions;
