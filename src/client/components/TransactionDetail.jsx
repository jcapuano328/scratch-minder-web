import React from 'react';
import { History } from 'react-router'
import { Paper, DatePicker, SelectField, MenuItem, TextField, IconButton, FlatButton, Snackbar,
         Toolbar, ToolbarGroup, ToolbarTitle  } from 'material-ui';
import {FormattedNumber} from 'react-intl';
import acctService from '../services/AccountsService';
import transService from '../services/TransactionsService';

//float: 'left',
let firstItemStyle = {};//{marginLeft: '10%'};
let itemStyle = {};//{marginLeft: '10px'};
let balanceStyle = {};//{float: 'right', margin: '1.5em auto'};

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
            balance: 0
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
        this.setState({description: e.target.value});
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

        transService.save(this.props.params.accountid,this.state.transaction)
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
        /*
        className={this.state.type!=='debit' ? '' : 'hidden'}
        disabled={this.state.type!=='debit'}
        */
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
                             <ToolbarTitle text={'Account ' + this.state.account}/>
                        </ToolbarGroup>
                        <ToolbarGroup float="left" style={{top: '32%', left: '20%', color: 'green'}}>
                             <FormattedNumber
                                 floatingLabelText='Balance'
                                 hintText='Current balance'
                                 value={this.state.balance} format="USD" />
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
                                style={firstItemStyle}
                                floatingLabelText="Date"
                                hintText='Date of transaction'
                                onChange={this.onChangeDate} />
                        </div>
                        <div>
                            <SelectField value={this.state.type}
                                style={itemStyle}
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
                                style={firstItemStyle}
                                onChange={this.onChangeSequence}
                                floatingLabelText="Sequence"
                                hintText='Next number in sequence'/>
                        </div>
                        <div>
                            <TextField value={this.state.description}
                                style={itemStyle}
                                onChange={this.onChangeDescription}
                                floatingLabelText="Description"
                                hintText='Description of transaction'/>
                        </div>
                        <div>
                            <TextField value={this.state.category}
                                style={itemStyle}
                                onChange={this.onChangeCategory}
                                floatingLabelText="Category"
                                hintText='Category of transaction'/>
                        </div>
                        <div style={{marginBottom: 25}}>
                            <TextField value={this.state.amount}
                                style={itemStyle}
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
