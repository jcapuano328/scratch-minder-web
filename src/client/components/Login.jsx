import React from 'react';
//import { History } from 'react-router'
import Auth from '../services/AuthService'

let Login = React.createClass({
    //mixins: [ History ],
    contextTypes: {
      router: React.PropTypes.object.isRequired
    },

    getInitialState() {
        return {
            user: '',
            password: '',
            loggedIn: Auth.loggedIn()
        }
    },

    componentWillMount() {
        if (this.state.loggedIn) {
            //this.history.replaceState(null, '/home');
            this.context.router.replace('/home');
        }
    },

    login(e) {
        e.preventDefault();
        let user = this.refs.user.value;
        let pass = this.refs.pass.value;

        Auth.login(user, pass)
        .then(() => {
            this.context.router.replace('/home');
            /*
            const { location } = this.props
            if (location.state && location.state.nextPathname) {
                //this.history.replaceState(null, location.state.nextPathname)
                browserHistory.push(location.state.nextPathname);
            } else {
                //this.history.replaceState(null, '/home')
                browserHistory.push('/home');
            }
            */
        })
        .catch(function(err) {
            alert("There's an error logging in");
            console.log("Error logging in", err);
        });
    },

    render() {
        return (
            <div className="login jumbotron center-block">
                <h1>Login</h1>
                <form role="form" onSubmit={this.login}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input ref="user" type="text" className="form-control" id="username" placeholder="Username" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input ref="pass" type="password" className="form-control" id="password" placeholder="Password" />
                    </div>
                    <button type="submit" className="btn btn-default">Submit</button>
                </form>
            </div>
        );
    }
});

module.exports = Login;
