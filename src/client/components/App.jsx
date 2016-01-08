import React from 'react'
//import { Link } from 'react-router'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import auth from '../services/AuthService';

let App = React.createClass({
    getInitialState() {
        return {
            loggedIn: auth.loggedIn()
        };
    },

    updateAuth(loggedIn) {
        this.setState({
            loggedIn: loggedIn
        });
    },

    componentWillMount() {
        auth.onChange = this.updateAuth
        auth.login()
    },

    render() {
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
                        <Navbar.Text>User</Navbar.Text>
                        <NavDropdown eventKey={3} title="JDoe" id="basic-nav-dropdown">
                          <MenuItem eventKey={3.1}>Accounts</MenuItem>
                          <MenuItem divider />
                          <MenuItem eventKey={3.2}>Profile</MenuItem>
                          <MenuItem divider />
                          <MenuItem eventKey={3.3}>Logout</MenuItem>
                        </NavDropdown>
                      </Nav>
                    </Navbar.Collapse>
                  </Navbar>
                  {this.props.children}
              </div>
        );
        /*
        return (
            <div>
                <ul>
                    <li>
                        {this.state.loggedIn ? (
                            <Link to="/logout">Log out</Link>
                        ) : (
                            <Link to="/login">Sign in</Link>
                        )}
                    </li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/accounts">Accounts</Link> (authenticated)</li>
                    <li><Link to="/users">Users</Link> (authenticated)</li>
                </ul>
                {this.props.children}
            </div>
        )
        */
    }
});

module.exports = App;
