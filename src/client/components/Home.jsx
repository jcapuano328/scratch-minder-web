import React from 'react';
import { Link, History } from 'react-router';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle, DropDownMenu, MenuItem, Snackbar } from 'material-ui';
import AccountsChart from './AccountsChart'
import TransactionsByCategoryChart from './TransactionsByCategoryChart'
import AccountBalanceHistoryChart from './AccountBalanceHistoryChart'
import auth from '../services/AuthService';
import acctService from '../services/AccountsService';
import transService from '../services/TransactionsService';
import _ from 'lodash';

let getDateRange = (range, unit) => {
    console.log('get range for last ' + range + ' ' + unit);
    let enddate = new Date();
    let startdate = new Date(enddate.getTime());
    if (unit == 'years') {
        startdate.setFullYear(startdate.getFullYear() - range);
    } else if (unit == 'months') {
        startdate.setMonth(startdate.getMonth() - range);
    } else {// if (unit == 'weeks')
        startdate.setDate(startdate.getDate() - (range * 7));
    }
    return {
        start: startdate,
        end: enddate
    };
}

let Home = React.createClass({
    mixins: [ History ],

    getInitialState() {
        return {
            loggedIn: auth.loggedIn(),
            accounts: [],
            transactionSummary: {},
            range: 6,
            rangeUnit: 'months',
            statusMessage: '',
            statusMessageDuration: 5000
        };
    },

    /*
    updateAuth(loggedIn, user) {
        this.setState({
            loggedIn: loggedIn,
            user: user
        });
    },
    */

    componentWillMount() {
        if (this.state.loggedIn) {
            return acctService.getAll()
            .then((data) => {
                this.setState({accounts: data});
                if (data.length > 0) {
                    this.onAccountSelected(data[0]);
                }
            })
            .catch((err) => {
                this.setState({statusMessage: err.message || err});
                console.error(err);
            });
        }
    },

    refreshDetails(acct) {
        // change the details
        acct = acct || this.state.account;
        let range = getDateRange(this.state.range, this.state.rangeUnit);
        console.log('fetch transactions for ' + acct.accountid);
        return transService.summary(acct.accountid, range.start, range.end, 'category')
        .then((data) => {
            console.log('Retrieved ' + data.transactions.length + ' transactions');
            this.setState({transactionSummary: data});
        })
        .catch((err) => {
            this.setState({statusMessage: err.message || err});
            console.error(err);
        });
    },

    onAccountSelected(acct) {
        console.log('selected account ' + acct.name + ' ' + acct.number);
        this.setState({account: acct}, () => {
            this.refreshDetails(acct);
        });
    },

    onGoTo(acct) {
        this.history.replaceState(null, '/account/' + acct.accountid + '/transactions');
    },

    onChangeRange(e,i,v) {
        console.log('range ' + v);
        this.setState({range: +v}, () => {
            this.refreshDetails();
        });
    },
    onChangeRangeUnit(e,i,v) {
        console.log('range unit ' + v);
        this.setState({rangeUnit: v}, () => {
            this.refreshDetails();
        });
    },

    welcomeView() {
        return (
            <div>
                <h1>Welcome!</h1>
                <p>
                    Please <Link to="/login">Sign in</Link> or <Link to="/signup">Sign up</Link> to get started!
                </p>
            </div>
        );
    },
    homeView() {
        return (
            <div>
                <Toolbar>
                    <ToolbarGroup float="left">
                         <ToolbarTitle text={'Accounts'} />
                    </ToolbarGroup>
                    <ToolbarGroup float="right">
                        <ToolbarTitle text="Last" />
                        <DropDownMenu value={this.state.range}
                            onChange={this.onChangeRange}
                            floatingLabelText="Range"
                            hintText='Length of Range'>
                            {
                                _.range(12).map((i) => {
                                    let n = i+1;
                                    return (
                                        <MenuItem key={n} value={n} primaryText={n.toString()}/>
                                    );
                                })
                            }
                        </DropDownMenu>
                        <DropDownMenu value={this.state.rangeUnit}
                            onChange={this.onChangeRangeUnit}
                            floatingLabelText="Range Unit"
                            hintText='Range Unit'>
                            <MenuItem key={1} value={'weeks'} primaryText={'Weeks'}/>
                            <MenuItem key={2} value={'months'} primaryText={'Months'}/>
                            <MenuItem key={3} value={'years'} primaryText={'Years'}/>
                        </DropDownMenu>
                    </ToolbarGroup>
                </Toolbar>
                <section style={{float: 'left', width: '25%', height: '100%'}}>
                    <AccountsChart data={this.state.accounts} onSelected={this.onAccountSelected} onGoTo={this.onGoTo}/>
                </section>
                <section style={{float: 'left', width: '75%', height: '100%'}}>
                    <TransactionsByCategoryChart data={this.state.transactionSummary.summary} />
                    <AccountBalanceHistoryChart data={this.state.transactionSummary.transactions} />
                </section>
                <Snackbar
                  open={!!this.state.statusMessage}
                  message={this.state.statusMessage}
                  autoHideDuration={this.state.statusMessageDuration}
                  onRequestClose={() => {
                      this.setState({statusMessage: ''});
                  }}
                />
            </div>
        );
    },

    render() {
        if (this.state.loggedIn) {
            return this.homeView();
        }
        return this.welcomeView();
    }
});

module.exports = Home;
