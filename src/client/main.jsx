import React from 'react';
import {render} from 'react-dom';
import { browserHistory, IndexRoute, Router, Route } from 'react-router'
import mui from 'material-ui';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {IntlProvider, addLocaleData} from 'react-intl';

injectTapEventPlugin();

import App from './components/App';
import Home from './components/Home';
import Login from './components/Login';
import Logout from './components/Logout';
import About from './components/About';
import Accounts from './components/Accounts';
import AccountDetail from './components/AccountDetail';
import Transactions from './components/Transactions';
import Users from './components/Users';
import UserDetail from './components/UserDetail';
import UserProfile from './components/UserProfile';
import auth from './services/AuthService';

/*if ('ReactIntlLocaleData' in window) {
    Object.keys(ReactIntlLocaleData).forEach((lang) => {
        addLocaleData(ReactIntlLocaleData[lang]);
    });
}*/

let intlData = {
    "locale": "en",
    "formats": {
        "date": {
            "day": "numeric",
            "month": "numeric",
            "year": "numeric"            
        },
        "number": {
            "USD": {
                "style": "currency",
                "currency": "USD",
                "minimumFractionDigits": 2
            },
            "percentage": {
                "style": "percent"
            }
        }
    }
};

render((
    <IntlProvider {...intlData}>
      <Router history={browserHistory}>
          <Route path="/" component={App}>
            <IndexRoute component={Home} />
            <Route path="login" component={Login} />
            <Route path="logout" component={Logout} />
            <Route path="about" component={About} />
            <Route path="userprofile" component={UserProfile} />
            <Route path="accounts" component={Accounts}>
                <Route path="/account/:accountId" component={AccountDetail} />
            </Route>
            <Route path="transactions" component={Transactions} />
            <Route path="users" component={Users}>
                <Route path="/user/:userId" component={UserDetail} />
            </Route>
          </Route>
      </Router>
    </IntlProvider>
), document.getElementById('content'));
