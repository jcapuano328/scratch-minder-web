//https://github.com/callemall/material-ui/issues/1511
import React from 'react';
import {TableFooter as TF, TableRow, TableRowColumn, FontIcon, IconButton} from 'material-ui';

const styles = {
  footerContent: {
    float: 'right'
  },
  footerText: {
    float: 'right',
    paddingTop: 16,
    height: 16
  }
};

const TableFooter = React.createClass({

  propTypes: {
    offset: React.PropTypes.number.isRequired, // current offset
    total: React.PropTypes.number.isRequired, // total number of rows
    limit: React.PropTypes.number.isRequired, // num of rows in each page
    onPageClick: React.PropTypes.func // what to do after clicking page number
  },

  render() {
    let offset = this.props.offset;
    let total = this.props.total;
    let limit = this.props.limit;
    return (
      <TF adjustForCheckbox={false}>
        <TableRow>
          <TableRowColumn style={styles.footerContent}>
            <IconButton iconClassName='fa fa-chevron-left' disabled={offset === 0} onTouchTap={this.props.onPageClick.bind(null, offset - limit)} />
            <IconButton iconClassName='fa fa-chevron-right' disabled={offset + limit >= total} onTouchTap={this.props.onPageClick.bind(null, offset + limit)} />
          </TableRowColumn>
          <TableRowColumn style={styles.footerText}>
            {(offset + 1) + '-' + Math.min((offset + limit), total) + ' of ' + total}
          </TableRowColumn>
        </TableRow>
      </TF>
    );
  }

});

export default TableFooter;
