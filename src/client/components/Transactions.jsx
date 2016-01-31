import React from 'react';
import { History } from 'react-router'
import { Paper, DatePicker, Snackbar, TextField,
        Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn,
        Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle, IconButton
        } from 'material-ui';
import {FormattedDate,FormattedNumber} from 'react-intl';
import Pager from './Pager';
import acctService from '../services/AccountsService';
import transService from '../services/TransactionsService';

let Transactions = React.createClass({
    mixins: [ History ],

    getInitialState() {
        return {
            account: '',
            transactions: [],
            pagingOffset: 0,
            pagingTotal: 0,
            pagingLimit: 5,
            selectedTransaction: null
        };
    },
    componentDidMount() {
        acctService.get(this.props.params.accountid)
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
        return transService.getAll(this.props.params.accountid)
        .then((transactions) => {
            this.setState({
                transactions: transactions,
                pagingOffset: 0,//transactions.length - this.state.pagingLimit,
                pagingTotal: transactions.length
            });
        })
        .catch((err) => {
            // show the snackbar?
            console.error(err);
        });
    },

    onAdd() {
        console.log('add');
    },
    onEdit() {
        if (this.state.selectedTransaction != null) {
            this.history.pushState(null, '/account/' + this.props.params.accountid + '/transactions/transaction/' + this.state.selectedTransaction);
        }
    },
    onDelete() {
        console.log('delete');
    },

    onPageClick(offset) {
        this.setState({pagingOffset: offset});
    },

    onRowSelect(selectedRows) {
        let transaction = (selectedRows.length > 0) ? this.state.transactions[selectedRows[0]+this.state.pagingOffset].transactionid : null;
        this.setState({selectedTransaction: transaction});
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
                            <IconButton
                                tooltip='Edit'
                                tooltipPosition='top-left'
                                iconClassName='fa fa-pencil-square-o'
                                disabled={!this.state.selectedTransaction}
                                onTouchTap={this.onEdit}
                                />
                            <IconButton
                                tooltip='Delete'
                                tooltipPosition='top-left'
                                iconClassName='fa fa-minus-square-o'
                                disabled={!this.state.selectedTransaction}
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
                                <TableHeaderColumn tooltip="Transaction Date">Date</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Transaction ID">ID</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Transaction Name">Name</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Transaction Category">Category</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Transaction Credit Amount">Credit</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Transaction Debit Amount">Debit</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Account Balance">Balance</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody stripedRows={true} displayRowCheckbox={true} deselectOnClickaway={false}>
                            {(this.state.transactions || []).slice(this.state.pagingOffset, this.state.pagingOffset+this.state.pagingLimit).map(this.makeTransaction)}
                        </TableBody>
                        <Pager offset={this.state.pagingOffset} total={this.state.pagingTotal} limit={this.state.pagingLimit} onPageClick={this.onPageClick}/>
                    </Table>
                </form>
            </Paper>
        );
    },

    makeTransaction(transaction, i) {
        let amount = (<FormattedNumber value={transaction.amount} format="USD" />);
        return (
            <TableRow key={transaction.transactionid}
                selected={!!this.state.selectedTransaction && this.state.selectedTransaction==transaction.transactionid}>
                <TableRowColumn><FormattedDate value={transaction.when} /></TableRowColumn>
                <TableRowColumn>{transaction.sequence}</TableRowColumn>
                <TableRowColumn>{transaction.description}</TableRowColumn>
                <TableRowColumn>{transaction.category}</TableRowColumn>
                <TableRowColumn>{transaction.type == 'credit' ? amount : ''}</TableRowColumn>
                <TableRowColumn>{transaction.type == 'debit' ? amount : ''}</TableRowColumn>
                <TableRowColumn><FormattedNumber value={transaction.balance} format="USD" /></TableRowColumn>
            </TableRow>
        );
    }
});

module.exports = Transactions;
