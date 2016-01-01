module.exports = {
    port: 4000,
    paths: {
        routes: './src/server/routes/'
    },
    session: {
        secret: 'scratch-minder',
        cookie: {
            maxAge: 86400,
            secure: false,
            httpOnly: true
        }
    },
    services: {
        host: 'http://localhost:3000',
        authverify: '/oauth/verify'
    },
    db: {
        server: 'localhost',
        port: 27017,
        name: 'scratchminder',
        options: {
            server: {
                maxPoolSize: 10
            },
            db: {
                journal: true,
                safe: true
            }
        }
    },
    log: {
        server: { // server-side logging parameters
            levels: ['error', 'warn', 'info', 'debug', 'trace'],
            transports: { // logging transports
                console: {
                    format: ['date', 'level', 'message'],
                    level: 'warn', // maximum level of logged messages
                    enabled: true, // this switch can be used to easily toggle use of a given transport
                    colorize: true, // this switch can be used to easily toggle use of colors
                    json: false	 // plain text or json output
                }
            }
        }
    }
};
