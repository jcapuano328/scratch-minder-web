import React from 'react';
import { Dialog, FlatButton  } from 'material-ui';


let ConfirmDialog = React.createClass({
    getInitialState() {
        return {
            open: false
        };
    },

    onOk() {
        //this.setState({open: false});
        this.props.onOk && this.props.onOk();
    },
    onCancel() {
        //this.setState({open: false});
        this.props.onCancel && this.props.onCancel();
    },

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={this.onCancel}
            />,
            <FlatButton
                label="OK"
                primary={true}
                onTouchTap={this.onOk}
            />
        ];
        return (
            <Dialog
                title={this.props.title}
                actions={actions}
                modal={true}
                open={this.props.open}
            >
                {this.props.prompt}
            </Dialog>
        );
    }
});

module.exports = ConfirmDialog;
