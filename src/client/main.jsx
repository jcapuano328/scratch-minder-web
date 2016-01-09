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

render((
  <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="login" component={Login} />
        <Route path="logout" component={Logout} />
        <Route path="about" component={About} />
        <Route path="accounts" component={Accounts} />
        <Route path="users" component={Users} />
      </Route>
  </Router>
), document.getElementById('content'));
