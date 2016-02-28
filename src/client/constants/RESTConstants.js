var BASE_URL = 'http://localhost:4000';

module.exports = {
  BASE_URL: BASE_URL,
  LOGIN_URL: BASE_URL + '/login',
  SIGNUP_URL: BASE_URL + '/users',
  LOGOUT_URL: BASE_URL + '/logout',
  USERS_URL: '/users',
  USER_URL:'/users/:id',
  PASSWORD_RESET_URL:'/users/:id/reset',
  ACCOUNTS_URL: '/accounts',
  ACCOUNT_URL:'/accounts/:id',
  TRANSACTIONS_URL: '/accounts/:id/transactions',
  TRANSACTION_URL: '/accounts/:id/transactions/:transactionid',
  TRANSACTIONS_SEARCH_URL: '/accounts/:id/transactions/search/:kind/:search'
};
