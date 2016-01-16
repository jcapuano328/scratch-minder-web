import React from 'react';
import { Link, History } from 'react-router';
import mui from 'material-ui';
import auth from '../services/AuthService';

// Get mui Components
let ThemeManager = mui.Styles.ThemeManager;
let AppBar = mui.AppBar
  , LeftNav = mui.LeftNav
  , MenuItem = mui.MenuItem
  //, LinkMenuItem = mui.LinkMenuItem
  , Divider = mui.Divider;


let App = React.createClass({
    mixins: [ History ],

    getInitialState() {
        return {
            loggedIn: auth.loggedIn(),
            user: auth.getUser(),
            navopen: false
        };
    },

    updateAuth(loggedIn, user) {
        this.setState({
            loggedIn: loggedIn,
            user: user
        });
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
            //this.context.router.transitionTo(route);
            this.history.replaceState(null, route);
        }
    },

    _onLeftNavChange(e, key, payload) {
        // Do DOM Diff refresh
        this.context.router.transitionTo(payload.route);
    },

    menuAppBar() {
        return <AppBar title="Scratch Minder" onLeftIconButtonTouchTap={this.handleClose} onTitleTouchTap={this.handleClose}/>
    },

    render() {
        //console.log(this.state.user.user.username);
        return (
            <div>
                <header>
                  <AppBar title='Scratch Minder' onLeftIconButtonTouchTap={this.handleToggle}>
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
                              <MenuItem onTouchTap={this.handleMenu('/logout')}>Logout</MenuItem>
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
