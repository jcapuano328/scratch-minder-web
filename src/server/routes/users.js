'use strict'
var log = require('../lib/log');

module.exports = [

    {
        method: 'get',
        uri: '/users',
        protected: true,
        handler: (req,res,next) => {}
    },
    {
        method: 'get',
        uri: '/users/:id',
        protected: true,
        handler: (req,res,next) => {}
    },
    {
        method: 'post',
        uri: '/users',
        protected: true,
        handler: (req,res,next) => {}
    },
    {
        method: 'put',
        uri: '/users/:id',
        protected: true,
        handler: (req,res,next) => {}
    },
    {
        method: 'delete',
        uri: '/users/:id',
        protected: true,
        handler: (req,res,next) => {}
    }



];
