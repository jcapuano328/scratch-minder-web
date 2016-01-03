'use strict'
var log = require('../lib/log');

module.exports = [
    {
        method: 'get',
        uri: '/accounts',
        protected: true,
        handler: (req,res,next) => {}
    },
    {
        method: 'get',
        uri: '/accounts/:id',
        protected: true,
        handler: (req,res,next) => {}
    },
    {
        method: 'get',
        uri: '/accounts/:id/transactions',
        protected: true,
        handler: (req,res,next) => {}
    },
    {
        method: 'get',
        uri: '/accounts/:id/transactions/:transid',
        protected: true,
        handler: (req,res,next) => {}
    },

    {
        method: 'post',
        uri: '/accounts',
        protected: true,
        handler: (req,res,next) => {}
    },
    {
        method: 'put',
        uri: '/accounts/:id',
        protected: true,
        handler: (req,res,next) => {}
    },
    {
        method: 'delete',
        uri: '/accounts/:id',
        protected: true,
        handler: (req,res,next) => {}
    }
];
