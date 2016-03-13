import React from 'react';
import { VictoryPie, VictoryLabel } from "victory";

let TransactionsByCategoryChart = React.createClass({
    emptyView() {
        return (<div />);
    },
    chartView() {
        return (
            <svg width="400px" height="400px">
                <VictoryLabel x={65} y={30} verticalAnchor="middle" horizontalAnchor="middle" standalone={false}
                    style={{fontWeight: 'bold', fontSize: 18}}>
                    Expeditures by Category
                </VictoryLabel>
                <VictoryPie
                    padding={{top: 45}}
                    innerRadius={60}
                    data={this.props.data.map((o) => {
                        return {
                            x: o.category,
                            y: o.total
                        };
                    })}
                    colorScale={[
                        "#F7464A",
                        "#46BFBD",
                        "#FDB45C"
                    ]}
                    standalone={false}
                />
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

module.exports = TransactionsByCategoryChart;
