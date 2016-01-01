var config = require('config')
    nub = require('scratch-minder-nub')(config);

var connstr = nub.ConnectionStringBuilder();

module.exports = {
    connect() {
        return nub.ConnectionPool.connect(connstr);
    },
    disconnect() {
        return nub.ConnectionPool.disconnect(connstr);
    }        
}
