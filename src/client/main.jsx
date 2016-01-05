var $ = global.jQuery = require('jquery');
require('bootstrap');

import React from 'react';
import {render} from 'react-dom';
import { browserHistory, Router, Route } from 'react-router'
import App from './components/App';
import Login from './components/Login';
import Logout from './components/Logout';
import About from './components/About';
import Accounts from './components/Accounts';
import Users from './components/Users';
import auth from './services/AuthService';

function requireAuth(nextState, replaceState) {
  if (!auth.loggedIn())
    replaceState({ nextPathname: nextState.location.pathname }, '/login')
}
/*
render((
    <Login />
), document.getElementById('content'));
*/
render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
      <Route path="about" component={About} />
      <Route path="accounts" component={Accounts} onEnter={requireAuth} />
      <Route path="users" component={Users} onEnter={requireAuth} />
    </Route>
  </Router>
), document.getElementById('content'));
