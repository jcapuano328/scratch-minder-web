import React from 'react';
import { Charts } from './Charts';

let colors = //['#43A19E', '#7B43A1', '#F2317A', '#FF9824', '#58CF6C'];
    //['red','green','orange','goldenrod','purple'];
    ['cornflowerblue'];

let AccountsChart = React.createClass({
    emptyView() {
        return (<div />);
    },
    chartView() {
        //<Legend labels={ this.state.labels } colors={ this.state.colors } />
        /*
        <div>
            <span style={{
                //backgroundColor: '#ccc',
                //fill: '#756f6a',
                //stroke: 'transparent',
                paddingLeft: 125,
                color: '#756f6a',
                whiteSpace: 'inherit',
                fontWeight: 'bold',
                fontSize: 18,
                fontFamily: 'Helvetica'
            }}>Accounts</span>
        </div>
        */
        return (
            <div style={{height:"800px", paddingTop: '20px'}} >
                <div>
                    <Charts
                        data={this.props.data.map((acct) => {
                            return [acct.balance];
                        })}
                        labels={this.props.data.map((acct) => {
                            return acct.name + ' ' + acct.number;
                        })}
                        colors={ colors }
                        horizontal={ true }
                        width={'95%'}
                        clickLabel={'Update charts'}
                        onClick={(e,s,i) => {
                            // load the chart data for this account
                            let account = this.props.data[s];
                            console.log(account.name + ' ' + account.number);
                            this.props.onSelected && this.props.onSelected(account);
                        }}
                        selectLabel={'View Transactions'}
                        onSelected={(e,s) => {
                            // go to transactions
                            let account = this.props.data[s];
                            console.log(account.name + ' ' + account.number);
                            this.props.onGoTo && this.props.onGoTo(account);
                        }}
                    />
                </div>
            </div>
        );
    },

    render() {
        if (this.props.data && this.props.data.length > 0) {
            return this.chartView();
        }
        return this.emptyView();
    }
});

module.exports = AccountsChart;
