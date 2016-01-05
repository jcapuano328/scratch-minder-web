import React from 'react'
import { Link } from 'react-router'
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
            <nav className="navbar navbar-default">
              <div className="container-fluid">
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                  <a className="navbar-brand" href="#">Brand</a>
                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav">
                    <li className="active"><a href="#">Link <span className="sr-only">(current)</span></a></li>
                    <li><a href="#">Link</a></li>
                    <li className="dropdown">
                      <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
                      <ul className="dropdown-menu">
                        <li><a href="#">Action</a></li>
                        <li><a href="#">Another action</a></li>
                        <li><a href="#">Something else here</a></li>
                        <li role="separator" className="divider"></li>
                        <li><a href="#">Separated link</a></li>
                        <li role="separator" className="divider"></li>
                        <li><a href="#">One more separated link</a></li>
                      </ul>
                    </li>
                  </ul>
                  <form className="navbar-form navbar-left" role="search">
                    <div className="form-group">
                      <input type="text" className="form-control" placeholder="Search"/>
                    </div>
                    <button type="submit" className="btn btn-default">Submit</button>
                  </form>
                  <ul className="nav navbar-nav navbar-right">
                    <li><a href="#">Link</a></li>
                    <li className="dropdown">
                      <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
                      <ul className="dropdown-menu">
                        <li><a href="#">Action</a></li>
                        <li><a href="#">Another action</a></li>
                        <li><a href="#">Something else here</a></li>
                        <li role="separator" className="divider"></li>
                        <li><a href="#">Separated link</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
        );
        /*
        return (
            <nav className="navbar navbar-default">
              <div className="container-fluid">
                <div className="navbar-header">
                  <a className="navbar-brand" href="#">Scratch Minder</a>
                </div>

                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav navbar-right">
                    <li className="dropdown">
                      <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
                      <ul className="dropdown-menu">
                        <li><a href="#">Action</a></li>
                        <li><a href="#">Another action</a></li>
                        <li><a href="#">Something else here</a></li>
                        <li role="separator" className="divider"></li>
                        <li><a href="#">Separated link</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
        );
        */
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
