var config = require('config');
    auth = require('../lib/auth');

module.exports = require('scratch-minder-nub')(config).Router(auth);
