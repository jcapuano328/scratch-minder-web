import React from 'react';
import {render} from 'react-dom';
import { browserHistory, IndexRoute, Router, Route } from 'react-router'
import App from './components/App';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import About from './components/About';
import Accounts from './components/Accounts';
import Users from './components/Users';
import auth from './services/AuthService';

function requireAuth(nextState, replaceState) {
  if (!auth.loggedIn())
    replaceState({ nextPathname: nextState.location.pathname }, '/')
}

/*
render((
    <Login />
), document.getElementById('content'));
*/
//<Route path="login" component={Login} />
/*
<Route path="/home" component={App}>
  <IndexRoute component={Home} />
  <Route path="logout" component={Logout} />
  <Route path="about" component={About} />
  <Route path="accounts" component={Accounts} />
  <Route path="users" component={Users} />
</Route>

*/

render((
  <Router history={browserHistory}>
    <Route path="/" component={Login}>
        <Route path="home" component={App}>
          <IndexRoute component={Home} />
          <Route path="logout" component={Logout} />
          <Route path="about" component={About} />
          <Route path="accounts" component={Accounts} />
          <Route path="users" component={Users} />
        </Route>
    </Route>
  </Router>
), document.getElementById('content'));
