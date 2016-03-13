import React from 'react';
import { VictoryLine, VictoryAxis, VictoryLabel } from "victory";
import _ from 'lodash';

let colors = //['#43A19E', '#7B43A1', '#F2317A', '#FF9824', '#58CF6C'];
    //['red','green','orange','goldenrod','purple'];
    ['cornflowerblue'];

//let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let AccountBalanceHistoryChart = React.createClass({
    getInitialState() {
        return {
            tickCount: 6
        };
    },
    emptyView() {
        return (<div />);
    },
    makeHorizontalTicks() {
        let first = new Date(this.props.data[this.props.data.length-1].when).getTime();
        let last = new Date(this.props.data[0].when).getTime();
        let step = (last - first) / this.state.tickCount;
        return _.range(this.state.tickCount).map((i) => {
            return new Date(first + (step*i));
        });
    },
    makeVerticalTicks() {
        let min = 99999999;
        let max = 0;
        this.props.data.forEach((txn) => {
            let b = parseFloat(txn.balance);
            min = Math.min(min, b);
            max = Math.max(max, b);
        });
        let step = (max - min) / this.state.tickCount;
        return _.range(this.state.tickCount).map((i) => {
            return min + (step*i);
        });
    },

    chartView() {
        let xticks = this.makeHorizontalTicks();
        let yticks = this.makeVerticalTicks();
        let data = this.props.data.map((txn) => {
            return {
                x: new Date(txn.when),
                y: parseFloat(txn.balance)
            };
        }).reverse();
        //console.log(data);
        //console.log(xticks);
        //console.log(yticks);
        //385
        return (
            <svg height="400px" width="400px">
                <VictoryLabel x={165} y={30} verticalAnchor="middle" horizontalAnchor="middle"
                    style={{fontWeight: 'bold', fontSize: 18}}>
                    Balance History
                </VictoryLabel>
                <VictoryAxis scale="time" standalone={false} height={400}
                    tickValues={xticks}
                    tickFormat={(x) => {
                        let month = x.getMonth();
                        //if (month == 0) {
                        //    return x.getFullYear();
                        //}
                        return months[month];
                    }}
                />
                <VictoryAxis dependentAxis standalone={false} height={400}
                    domain={[0,yticks[yticks.length-1]]}
                    tickValues={yticks}
                    tickFormat={(y) => {return '$' + Math.ceil(y).toString();}}
                />
                <VictoryLine data={data} standalone={false} />
            </svg>
        );
    },
    render() {
        if (this.props.data && this.props.data.length > 0) {
            return this.chartView();
        }
        return this.emptyView();
    }
});

module.exports = AccountBalanceHistoryChart;
