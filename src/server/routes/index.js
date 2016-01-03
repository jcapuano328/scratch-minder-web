'use strict'
var path = require('path');
var log = require('../lib/log');

module.exports = [
    {
        method: 'get',
        uri: '/',
        protected: false,
        handler: (req,res,next) => {
            return new Promise((resolve,reject) => {
                log.info('Render main page');
                res.sendFile(path.join(__dirname, '..', 'content', 'views', 'index.html'), (err) => {
                    if (err) {
                        log.error('Failed to render main page: ' + err);
                        //res.send(500);
                        reject(err);
                    } else {
                        log.trace('Rendered main page');
                        resolve();
                    }
                });
            })
        }
    }
];
