var util = require('../utils/utils');
var generalApiRequests = require('./general-api-requests');

module.exports = {

    getPrice: function() {
        var responseRequest = generalApiRequests.httpResponse('https://api.bitcointrade.com.br/v2/public/BRLBTC/ticker', 'BitcoinTrade');
        return {
            httpResponseStatus: responseRequest.httpResponseStatus,
            httpResponseText: getJustLastPrice('data', JSON.parse(responseRequest.httpResponseText))
        };
    }
};

function getJustLastPrice(key, json) {
    try {
        return json[key].last.toFixed(2);
    } catch (error) {
        util.showLog('Falha ao obter a resposta...')
        module.exports.getPrice();
    }
}
//module.exports.getPrice();