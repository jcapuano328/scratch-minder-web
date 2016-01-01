'use strict'
var log = require('../lib/log');

module.exports = [
    {
        method: 'post',
        uri: '/login',
        protected: false,
        handler: (req,res,next) => {

            return next();
        }
    },
    {
        method: 'post',
        uri: '/logout',
        protected: false,
        handler: (req,res,next) => {

            return next();
        }
    }

];
