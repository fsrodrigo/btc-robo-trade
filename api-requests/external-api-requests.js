var util = require('../utils/utils');
var generalApiRequests = require('./general-api-requests');

module.exports = {

    getPrice: function() {
        var responseRequest = generalApiRequests.httpResponse('https://blockchain.info/ticker', 'Internacional');
        return {
            httpResponseStatus: responseRequest.httpResponseStatus,
            httpResponseText: getPriceSpecifyCurrency('USD', JSON.parse(responseRequest.httpResponseText))
        };
    }
};

function getPriceSpecifyCurrency(currency, json) {
    return json[currency].last.toFixed(2);
}