module.exports = (status, statusText, bodyjson, bodystr) => {
    return {
        status: status,
        statusText: statusText,
        json() {
            return bodyjson;
        },
        text() {
            return bodystr;
        }
    };
}
