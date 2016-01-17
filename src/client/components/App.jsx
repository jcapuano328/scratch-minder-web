import React from 'react';
import { Link, History } from 'react-router';
import mui from 'material-ui';
import FontAwesome from 'react-fontawesome';
import auth from '../services/AuthService';
var crypto = require('crypto');
var gravataruri = 'http://www.gravatar.com/avatar/';

// Get mui Components
//let ThemeManager = mui.Styles.ThemeManager;
let AppBar = mui.AppBar,
    Avatar = mui.Avatar,
    IconMenu = mui.IconMenu,
    IconButton = mui.IconButton,
    FontIcon = mui.FontIcon,
    LeftNav = mui.LeftNav,
    MenuItem = mui.MenuItem,
    Divider = mui.Divider;


let App = React.createClass({
    mixins: [ History ],

    getInitialState() {
        return {
            loggedIn: auth.loggedIn(),
            user: auth.getUser()
        };
    },

    updateAuth(loggedIn, user) {
        this.setState({
            loggedIn: loggedIn,
            user: user
        });
    },

    componentWillUnmount() {
        auth.onChange = () => {}
    },

    componentWillMount() {
        auth.onChange = this.updateAuth
        //auth.login()
    },

    /*getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },*/

    handleToggle() {
        this.setState({open: !this.state.open});
    },

    handleClose() {
        this.setState({open: false});
    },

    handleMenu(route) {
        return (e,idx) => {
            this.handleClose();
            this.history.replaceState(null, route);
        }
    },

    handleSignIn() {
        this.history.replaceState(null, '/login');
    },

    menuAppBar() {
        return <AppBar title="Scratch Minder" onLeftIconButtonTouchTap={this.handleClose} onTitleTouchTap={this.handleClose}/>
    },

    render() {
        //console.log(this.state.user.user.username);
        //console.log(JSON.stringify(this.state.user));
        var profileuri = '';
        if (this.state.loggedIn) {
            var email = this.state.user != null ? this.state.user.user.email : '';
            var hash = crypto.createHash('md5').update(email).digest("hex");
            profileuri = gravataruri + hash;
        }

        return (
            <div>
                <header>
                  <AppBar title='Scratch Minder'
                    onTitleTouchTap={this.handleToggle}
                    onLeftIconButtonTouchTap={this.handleToggle}
                    iconElementRight={
                        this.state.loggedIn ? (
                            <IconMenu
                                iconButtonElement={
                                    <IconButton><Avatar src={profileuri} /></IconButton>
                                }
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            >
                                <MenuItem onTouchTap={this.handleMenu('/userprofile')}>Profile</MenuItem>
                                <Divider />
                                <MenuItem onTouchTap={this.handleMenu('/logout')}>Sign Out</MenuItem>
                            </IconMenu>
                        ) : (
                            <IconButton
                                tooltip='Sign In'
                                tooltipPosition='bottom-left'
                                iconClassName='fa fa-user'
                                onTouchTap={this.handleSignIn}
                                />
                        )
                    }>
                      {!this.state.loggedIn ? (
                          <LeftNav
                              docked={false}
                              open={this.state.open}
                          >
                            {this.menuAppBar()}
                            <MenuItem onTouchTap={this.handleMenu('login')}>Sign In</MenuItem>
                          </LeftNav>
                      ) : (
                          <LeftNav
                              docked={false}
                              open={this.state.open}
                          >
                              {this.menuAppBar()}
                              <MenuItem onTouchTap={this.handleMenu('/')}>Home</MenuItem>
                              <Divider />
                              <MenuItem onTouchTap={this.handleMenu('/accounts')}>Accounts</MenuItem>
                              <MenuItem onTouchTap={this.handleMenu('/users')}>Users</MenuItem>
                              <Divider />
                              <MenuItem onTouchTap={this.handleMenu('/userprofile')}>Profile</MenuItem>
                              <MenuItem onTouchTap={this.handleMenu('/about')}>About</MenuItem>
                              <Divider />
                              <MenuItem onTouchTap={this.handleMenu('/logout')}>Sign Out</MenuItem>
                          </LeftNav>
                      )}

                  </AppBar>
                </header>

                <section className="content">
                  {this.props.children}
                </section>
            </div>
        );
    }
});

module.exports = App;
