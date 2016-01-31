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
        auth: {
            login: '/login',
            grant: '/oauth/token',
            verify: '/oauth/verify',
        },
        accounts: {
            accounts: '/user/:userid/accounts',
            account: '/user/:userid/accounts/:id'
        },
        transactions: {
            transactions: '/user/:userid/account/:accountid/transactions',
            transaction: '/user/:userid/account/:accountid/transactions/:id'
        },
        users: {
            users: '/users',
            user: '/users/:id'
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
