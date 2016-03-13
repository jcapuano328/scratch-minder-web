import React from 'react';
import {FormattedNumber} from 'react-intl';
import { IconButton } from 'material-ui';


let compareNumbers = (a, b) => {
  return a - b;
}

var Legend = React.createClass({
  render: function () {
    var labels = this.props.labels,
      colors = this.props.colors;

    return (
    <div className="Legend">
      { labels.map(function(label, labelIndex) {
        return (
        <div>
          <span className="Legend--color" style={{ backgroundColor: colors[labelIndex % colors.length]  }} />
          <span className="Legend--label">{ label }</span>
        </div>
        );
      }) }
    </div>
    );
  }
});

var Charts = React.createClass({
  render: function () {
    var self = this,
      data = this.props.data,
      layered = this.props.grouping === 'layered' ? true : false,
      stacked = this.props.grouping === 'stacked' ? true : false,
      opaque = this.props.opaque,
      max = 0;

    for (var i = data.length; i--; ) {
      for (var j = data[i].length; j--; ) {
        if (data[i][j] > max) {
          max = data[i][j];
        }
      }
    }


    return (
      <div className={ 'Charts' + (this.props.horizontal ? ' horizontal' : '' ) }>
        { data.map(function (serie, serieIndex) {
          var sortedSerie = serie.slice(0),
            sum;

          sum = serie.reduce(function (carry, current) {
            return carry + current;
          }, 0);
          sortedSerie.sort(compareNumbers);

          return (
            <div className={ 'Charts--serie ' + (self.props.grouping) }
              key={ serieIndex }
              style={{ height: self.props.height ? self.props.height: 'auto',
                        width: self.props.width ? self.props.width: 'auto'}}
            >
            <IconButton
                tooltip='Go To'
                tooltipPosition='top-left'
                iconClassName='fa fa-arrow-circle-right'
                onTouchTap={(e) => {
                    self.props.onSelected && self.props.onSelected(e, serieIndex);
                }}
            />
            <IconButton
                tooltip='Charts'
                tooltipPosition='top-left'
                iconClassName='fa fa-pie-chart'
                onTouchTap={(e) => {
                    self.props.onClick && self.props.onClick(e, serieIndex);
                }}
            />

            <label>{ self.props.labels[serieIndex] }</label>
            { serie.map(function (item, itemIndex) {
              var color = self.props.colors[itemIndex], style,
                size = item / (stacked ? sum : max) * 100;

              style = {
                backgroundColor: color,
                opacity: 1,//opaque ? 1 : (item/max + .05),
                zIndex: item
              };

              if (self.props.horizontal) {
                style['width'] = size + '%';
                style['height'] = '20px';
              } else {
                style['height'] = size + '%';
              }

              if (layered && !self.props.horizontal) {
                //console.log(sortedSerie, serie, sortedSerie.indexOf(item));
                style['right'] = ((sortedSerie.indexOf(item) / (serie.length + 1)) * 100) + '%';
                // style['left'] = (itemIndex * 10) + '%';
            }

             return (
               <div
                className={ 'Charts--item ' + (self.props.grouping) }
                style={ style }
                key={ itemIndex }
                onClick={(e) => {
                    self.props.onClick && self.props.onClick(e, serieIndex, itemIndex);
                }}
              >
                <b style={{ color: 'black', left:'100%'}}><FormattedNumber value={item} format="USD" /></b>
               </div>
            );
            }) }
            </div>
          );
        }) }
      </div>
    );
  }
});

module.exports = {
    Charts: Charts,
    Legend: Legend
};
