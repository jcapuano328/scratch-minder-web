import React from 'react';
import { Link } from 'react-router';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import auth from '../services/AuthService';

let App = React.createClass({
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

    componentWillMount() {
        auth.onChange = this.updateAuth
        //auth.login()
    },

    render() {
        //console.log(this.state.user.user.username);
        return (
            <div>
                <Navbar inverse>
                    <Navbar.Header>
                      <Navbar.Brand>
                        <a href="#">Scratch Minder</a>
                      </Navbar.Brand>
                      <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                      <Nav pullRight>
                        {!this.state.loggedIn ? (
                            <Link to="/login">Sign in</Link>
                        ) : (
                            <NavDropdown eventKey={3} title={this.state.user.user.firstname} id="basic-nav-dropdown">
                                <MenuItem eventKey={3.1} href='#/accounts'>Accounts</MenuItem>
                                <MenuItem divider />
                                <MenuItem eventKey={3.2} href='#/profile'>Profile</MenuItem>
                                <MenuItem className={auth.isInRole('admin') ? 'divider' : 'hidden'} />
                                <MenuItem eventKey={3.3} href='#/users' className={auth.isInRole('admin') ? '' : 'hidden'}>Users</MenuItem>
                                <MenuItem divider />
                                <MenuItem eventKey={3.4} href='#/logout'>Logout</MenuItem>
                            </NavDropdown>
                        )}
                      </Nav>
                    </Navbar.Collapse>
                  </Navbar>
                  {this.props.children}
              </div>
        );
    }
});

module.exports = App;
