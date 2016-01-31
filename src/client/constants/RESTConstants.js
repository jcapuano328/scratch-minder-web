var BASE_URL = 'http://localhost:4000';

module.exports = {
  BASE_URL: BASE_URL,
  LOGIN_URL: BASE_URL + '/login',
  SIGNUP_URL: BASE_URL + '/users',
  LOGOUT_URL: BASE_URL + '/logout',
  ACCOUNTS_URL: BASE_URL + '/accounts',
  ACCOUNT_URL:'/accounts/:id',
  TRANSACTIONS_URL: '/accounts/:id/transactions',
  TRANSACTION_URL: '/accounts/:id/transactions/:transactionid'
};
