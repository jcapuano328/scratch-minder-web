import React from 'react';
import { History } from 'react-router'
import { Paper, DatePicker, SelectField, MenuItem, AutoComplete, TextField, IconButton, FlatButton, Snackbar,
         Toolbar, ToolbarGroup, ToolbarTitle  } from 'material-ui';
import {FormattedNumber} from 'react-intl';
import acctService from '../services/AccountsService';
import transService from '../services/TransactionsService';

let TransactionDetail = React.createClass({
    mixins: [ History ],

    getInitialState() {
        return {
            account: '',
            transaction: null,
            when: new Date(),
            sequence: null,
            description: null,
            category: null,
            type: null,
            amount: null,
            balance: 0,
            isnew: (this.props.params.transactionId == 'new'),
            descriptionSource: []
        };
    },

    componentWillMount() {
        acctService.get(this.props.params.accountid)
        .then((account) => {
            //this.setState({account: account.number});
            return transService.get(this.props.params.accountid, this.props.params.transactionId)
            .then((transaction) => {
                this.setState({
                    account: account.number,
                    when: transaction.when,
                    sequence: transaction.sequence,
                    description: transaction.description,
                    category: transaction.category,
                    type: transaction.type,
                    amount: transaction.amount,
                    balance: transaction.balance,
                    transaction: transaction
                });
            });
        })
        .catch((err) => {
            // show the snackbar?
            console.error(err);
        });
    },

    onChangeDate(e,v) {
        this.setState({when: v});
    },
    onChangeSequence(e) {
        this.setState({sequence: e.target.value});
    },
    onChangeDescription(e) {
        //console.log(e);
        //this.setState({description: e.target.value});
        this.setState({description: e});
        if (e) {
            transService.search(this.props.params.accountid, 'description', e)
            .then((data) => {
                this.setState({
                    descriptionSource: data.map((txn) => {
                        //return txn.description + ' - ' + txn.category + ' - ' + txn.amount;
                        //console.log(txn.description);
                        return {
                            text: txn.description,
                            value: (
                                <MenuItem
                                    primaryText={txn.description}
                                    secondaryText={txn.amount}
                                />
                            ),
                            txn: txn
                        };
                    })
                });
            })
            .catch((err) => {
                console.error(err);
            });
        }
    },
    onSelectDescription(t,i,d) {
        console.log(t);
        let txn = d[i].txn;
        this.setState({
            description: txn.description,
            category: txn.category,
            type: txn.type,
            amount: txn.amount
        });
    },
    onChangeCategory(e) {
        this.setState({category: e.target.value});
    },
    onChangeType(e,i,v) {
        this.setState({type: v});
    },
    onChangeAmount(e) {
        //console.log(e.target.value);
        if (!isNaN(parseFloat(e.target.value))) {
            this.setState({amount: e.target.value});
        }
    },
    onOk(e) {
        // call the service to save the data
        this.state.transaction.when = this.state.when;
        this.state.transaction.sequence = this.state.sequence;
        this.state.transaction.description = this.state.description;
        this.state.transaction.category = this.state.category;
        this.state.transaction.type = this.state.type;
        this.state.transaction.amount = this.state.amount;

        transService.save(this.props.params.accountid,this.state.transaction,this.state.isnew)
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
                            <ToolbarTitle text={(this.state.isnew ? 'Add' : 'Modify') + ' Transaction'}/>
                        </ToolbarGroup>
                        <ToolbarGroup float="left" style={{top: '32%', left: '10%'}}>
                            <label>{'Account ' + this.state.account}</label>
                            <span style={{paddingLeft: '0.5em', color: 'green'}}><FormattedNumber value={this.state.balance} format="USD" /></span>
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
                        </ToolbarGroup>
                    </Toolbar>
                    <div style={{textAlign: 'center'}}>
                        <div>
                            <DatePicker value={new Date(this.state.when)} autoOk={true}
                                floatingLabelText="Date"
                                hintText='Date of transaction'
                                onChange={this.onChangeDate} />
                        </div>
                        <div>
                            <SelectField value={this.state.type}
                                onChange={this.onChangeType}
                                floatingLabelText="Type"
                                hintText='Type of transaction'>
                                <MenuItem value={'debit'} primaryText="Debit"/>
                                <MenuItem value={'credit'} primaryText="Credit"/>
                                <MenuItem value={'set'} primaryText="Set Balance"/>
                            </SelectField>
                        </div>
                        <div>
                            <TextField value={this.state.sequence}
                                onChange={this.onChangeSequence}
                                floatingLabelText="Sequence"
                                hintText='Next number in sequence'/>
                        </div>
                        <div>
                            <AutoComplete
                                value={this.state.description}
                                onNewRequest={this.onSelectDescription}
                                onUpdateInput={this.onChangeDescription}
                                dataSource={this.state.descriptionSource}
                                floatingLabelText="Description"
                                hintText='Description of transaction'/>
                        </div>
                        <div>
                            <TextField value={this.state.category}
                                onChange={this.onChangeCategory}
                                floatingLabelText="Category"
                                hintText='Category of transaction'/>
                        </div>
                        <div style={{marginBottom: 25}}>
                            <TextField value={this.state.amount}
                                onChange={this.onChangeAmount}
                                floatingLabelText="Amount"
                                hintText='Transaction amount'/>
                        </div>
                    </div>
                </form>
            </Paper>
        );
    }
});

module.exports = TransactionDetail;
